// =========================================================
// A tiny client for the Knesset's open data API.
// =========================================================
// The Knesset publishes its data as "OData" - a standard way
// to expose database tables over the web. You ask for a table
// ( they call it a collection, e.g. KNS_Bill ), optionally
// filter it, and get JSON back.
//
// Two things about their filter syntax, because it is not
// obvious:
//   $filter=BillID eq 2203845          -> "eq" means equals
//   $filter=substringof('טקסט',Name)   -> contains
// Everything has to be URL-encoded, which is what fetchOData
// below takes care of.
//
// No API key, no registration, no rate limit that we hit. Be
// polite anyway: this script runs nightly, not per page view.

const PARLIAMENT = "https://knesset.gov.il/Odata/ParliamentInfo.svc";
const VOTES = "https://knesset.gov.il/Odata/Votes.svc";

// One request. `params` is a plain object like
// { $filter: "BillID eq 5", $top: 100 }.
async function fetchOData(base, collection, params = {}) {
  const query = new URLSearchParams({ $format: "json", ...params }).toString();
  const url = `${base}/${collection}?${query}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Knesset API ${res.status} for ${collection}: ${url}`);
  }
  const body = await res.json();
  // OData wraps rows in a "value" array.
  return body.value ?? [];
}

// The API returns at most 100 rows per request and tells you
// nothing about it, so a naive query silently truncates. This
// walks pages until a short page comes back.
//
// If the caller explicitly asks for a $top, they want a small
// peek, not the whole table - honour it and do a single request.
async function fetchAll(base, collection, params = {}, pageSize = 100) {
  if (params.$top) return fetchOData(base, collection, params);

  const out = [];
  let skip = 0;
  for (;;) {
    const page = await fetchOData(base, collection, {
      ...params,
      $top: pageSize,
      $skip: skip,
    });
    out.push(...page);
    if (page.length < pageSize) return out;
    skip += pageSize;
    // A safety stop, so a bug can never spin forever.
    if (skip > 20000) return out;
  }
}

export const knesset = {
  parliament: (collection, params) => fetchAll(PARLIAMENT, collection, params),
  votes: (collection, params) => fetchAll(VOTES, collection, params),
  // For the rare case where we truly want one row and no paging.
  one: async (collection, params) => {
    const rows = await fetchOData(PARLIAMENT, collection, { ...params, $top: 1 });
    return rows[0];
  },
};

// Helper: build an OData "X eq 1 or X eq 2 or ..." filter, for
// looking up many ids in one request instead of one per id.
export function anyOf(field, ids) {
  return ids.map((id) => `${field} eq ${id}`).join(" or ");
}
