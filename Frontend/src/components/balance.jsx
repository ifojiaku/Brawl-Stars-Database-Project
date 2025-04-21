import { supabase_connection } from "../supabase/supabase";

// min usage meaning the amount of usage per each brawler that is going to be included into the table(exlcudes brawlers with little usage)
export async function evaluateBrawlerBalance(minUsage = 20) {
  // 1) load the view
  const { data: rows, error } = await supabase_connection
    .from("brawler_performance")
    .select("brawler_id, name, usage_count, win_rate");

  if (error) {
    console.error("Error fetching brawler_performance:", error);
    return [];
  }

  // 2) filter out low‑usage brawlers(iwth min usuage)
  const filtered = rows.filter(r => r.usage_count >= minUsage);

  if (filtered.length === 0) return [];

  // 3) compute mean and SD of win_rate
  const rates = filtered.map(r => r.win_rate);
  const mean = rates.reduce((sum, x) => sum + x, 0) / rates.length;
  const variance =
    rates.reduce((sum, x) => sum + (x - mean) ** 2, 0) / rates.length;
  const sd = Math.sqrt(variance);

  // 4) build suggestions
  const suggestions = filtered.map(r => {
    const z = (r.win_rate - mean) / sd;
    let suggestion, reason;

    if (z > 1) {
      suggestion = "nerf";
      reason = `win_rate ${ r.win_rate.toFixed(1)  }% is ${ z.toFixed(2) }σ above average`;
    } else if (z < -1) {
      suggestion = "buff";
      reason = `win_rate ${ r.win_rate.toFixed(1)  }% is ${ Math.abs(z).toFixed(2) }σ below average`;
    } else {
      suggestion = "stable";
      reason = `win_rate ${ r.win_rate.toFixed(1)  }% is within ±1σ`;
    }

    return {
      brawler_id:   r.brawler_id,
      name:         r.name,
      usage_count:  r.usage_count,
      win_rate:     r.win_rate,
      z_score:      z,
      suggestion,
      reason
    };
  });

  // 5) sort by extremity(of the z scores)
  suggestions.sort((a, b) => Math.abs(b.z_score) - Math.abs(a.z_score));
  return suggestions;
}

// ex
(async () => {
  const recs = await evaluateBrawlerBalance(30);
  recs.forEach(r => {
    console.log(
      `${r.name} (ID ${r.brawler_id}): ${r.suggestion.toUpperCase()} — ${r.reason}`
    );
  });
})();
