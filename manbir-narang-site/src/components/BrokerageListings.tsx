/** Banner linking to the full RE/MAX Mid-Island Realty listings page. */
export const BROKERAGE_LISTINGS_URL = "https://midislandrealty.com/all-listings/";

export default function BrokerageListings() {
  return (
    <div className="w bkw">
      <div className="strip bks">
        <div>
          <div className="bkeye">RE/MAX Mid-Island Realty</div>
          <h3>More listings from my brokerage</h3>
          <p>Browse every home currently listed by RE/MAX Mid-Island Realty. See one you like? I am happy to show it to you.</p>
        </div>
        <div className="bkbtns">
          <a className="btn" href={BROKERAGE_LISTINGS_URL} target="_blank" rel="noopener noreferrer">Browse all listings ↗</a>
          <a className="btn o" href="/contact">Ask Manbir</a>
        </div>
      </div>
    </div>
  );
}
