"use client";

import { useState } from "react";
import { SectionHead } from "./ui";

const num = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
const fm = (x: number) => "$" + Math.round(x).toLocaleString("en-CA");

export default function Calculator() {
  const [v, setV] = useState({ price: "1,200,000", down: "20", rate: "4.5", years: "25", tax: "5,400", fee: "0" });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value });

  const price = num(v.price), down = num(v.down) / 100, rate = num(v.rate) / 100, n = num(v.years) * 12;
  const loan = price * (1 - down);
  // Canadian mortgages compound semi-annually
  const i = Math.pow(1 + rate / 2, 1 / 6) - 1;
  const pay = i > 0 && n > 0 ? (loan * i) / (1 - Math.pow(1 + i, -n)) : n > 0 ? loan / n : 0;
  const extra = num(v.tax) / 12 + num(v.fee);

  const field = (label: string, k: keyof typeof v) => (
    <label className="cin">
      <span>{label}</span>
      <input value={v[k]} onChange={set(k)} inputMode="decimal" />
    </label>
  );

  return (
    <section className="dk">
      <div className="w">
        <SectionHead title="Mortgage calculator" sub="Estimate your monthly cost. For illustration only." />
        <div className="calc">
          <div className="cf">
            {field("Home price", "price")}
            {field("Down payment (%)", "down")}
            {field("Interest rate (%)", "rate")}
            {field("Amortization (years)", "years")}
            {field("Property tax (per year)", "tax")}
            {field("Strata fee (per month)", "fee")}
          </div>
          <div className="cres">
            <span>Estimated monthly total</span>
            <b className="gt mo">{fm(pay + extra)}</b>
            <div className="cx">
              <div>Mortgage payment<em>{fm(pay)}</em></div>
              <div>Tax and strata<em>{fm(extra)}</em></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
