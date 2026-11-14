import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { checkDeposit } from '../api';
import type { DepositCheckResult } from '@doorspeaks/shared';
import LoadingSpinner from '../components/LoadingSpinner';

const LOCALITIES = [
  'Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Marathahalli',
  'Bellandur', 'Electronic City', 'JP Nagar', 'Jayanagar', 'BTM Layout',
  'Hebbal', 'Yelahanka', 'Banashankari', 'Malleshwaram', 'Sarjapur Road',
  'Other',
];

const VERDICT_CONFIG = {
  'Typical': { color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300', icon: '✅', label: 'Typical' },
  'High': { color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300', icon: '⚠️', label: 'High' },
  'Potentially excessive': { color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300', icon: '🚨', label: 'Potentially Excessive' },
};

function DepositResult({ result, onPrint }: { result: DepositCheckResult; onPrint: () => void }) {
  const cfg = VERDICT_CONFIG[result.verdict];
  return (
    <div className="space-y-5">
      {/* Verdict */}
      <div className={`card p-6 border ${cfg.color}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{cfg.icon}</span>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide opacity-70">Verdict</div>
            <div className="text-2xl font-bold">{cfg.label}</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed">{result.explanation}</p>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div>
            <span className="font-semibold">Your deposit:</span> {result.depositMonths.toFixed(1)} months
          </div>
          <div>
            <span className="font-semibold">Market range:</span> {result.norm.min}–{result.norm.max} months
          </div>
        </div>
      </div>

      {/* Legal context */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-2">📜 Legal Context</h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{result.legalContext}</p>
      </div>

      {/* Red flags */}
      {result.redFlags.length > 0 && (
        <div className="card p-5 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
          <h3 className="font-semibold text-red-800 dark:text-red-300 mb-3">🚨 Red Flags</h3>
          <ul className="space-y-2">
            {result.redFlags.map((flag, i) => (
              <li key={i} className="text-sm text-red-700 dark:text-red-300 flex gap-2">
                <span className="shrink-0 mt-0.5">•</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Negotiating points */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-3">💬 Negotiating Points</h3>
        <ul className="space-y-2">
          {result.negotiatingPoints.map((pt, i) => (
            <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
              <span className="text-teal-600 dark:text-teal-400 shrink-0 font-bold">→</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Document checklist */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-3">📋 Document Checklist</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Ask your landlord for these before signing:</p>
        <ul className="space-y-2">
          {result.documentChecklist.map((doc, i) => (
            <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2 items-start">
              <input type="checkbox" className="mt-0.5 rounded" readOnly />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <button onClick={onPrint} className="btn-secondary text-sm">
          🖨️ Print Summary for Negotiation
        </button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
        ⚠️ Deposit norms are based on market observations, not statutory caps. The Karnataka Rent Act 1999 does not prescribe a legal maximum. This is not legal advice.
      </p>
    </div>
  );
}

export default function DepositCheck() {
  const [form, setForm] = useState({
    monthlyRent: '',
    depositAsked: '',
    propertyType: 'residential' as 'residential' | 'commercial',
    locality: 'Koramangala',
    leaseLength: '11',
    isRegistered: false,
    maintenanceCharge: '',
  });
  const [result, setResult] = useState<DepositCheckResult | null>(null);

  const mutation = useMutation({
    mutationFn: checkDeposit,
    onSuccess: (data) => setResult(data),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      monthlyRent: parseInt(form.monthlyRent, 10),
      depositAsked: parseInt(form.depositAsked, 10),
      propertyType: form.propertyType,
      locality: form.locality,
      leaseLength: parseInt(form.leaseLength, 10),
      isRegistered: form.isRegistered,
      maintenanceCharge: parseInt(form.maintenanceCharge || '0', 10),
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Deposit Legality Checker</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Is your security deposit amount fair for Bangalore? Check against market norms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div>
              <label className="label" htmlFor="monthlyRent">Monthly Rent (₹)</label>
              <input
                id="monthlyRent"
                type="number"
                required
                min={1000}
                value={form.monthlyRent}
                onChange={(e) => setForm((f) => ({ ...f, monthlyRent: e.target.value }))}
                className="input"
                placeholder="25000"
              />
            </div>

            <div>
              <label className="label" htmlFor="depositAsked">Deposit Asked (₹)</label>
              <input
                id="depositAsked"
                type="number"
                required
                min={0}
                value={form.depositAsked}
                onChange={(e) => setForm((f) => ({ ...f, depositAsked: e.target.value }))}
                className="input"
                placeholder="250000"
              />
              {form.monthlyRent && form.depositAsked && (
                <p className="text-xs text-slate-500 mt-1">
                  = {(parseInt(form.depositAsked) / parseInt(form.monthlyRent)).toFixed(1)} months' rent
                </p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="locality">Locality</label>
              <select
                id="locality"
                value={form.locality}
                onChange={(e) => setForm((f) => ({ ...f, locality: e.target.value }))}
                className="input"
              >
                {LOCALITIES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="propertyType">Property Type</label>
              <select
                id="propertyType"
                value={form.propertyType}
                onChange={(e) => setForm((f) => ({ ...f, propertyType: e.target.value as 'residential' | 'commercial' }))}
                className="input"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="label" htmlFor="leaseLength">Lease Length (months)</label>
              <select
                id="leaseLength"
                value={form.leaseLength}
                onChange={(e) => setForm((f) => ({ ...f, leaseLength: e.target.value }))}
                className="input"
              >
                <option value="6">6 months</option>
                <option value="11">11 months</option>
                <option value="12">12 months (registered)</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </select>
            </div>

            <div>
              <label className="label" htmlFor="maintenanceCharge">Monthly Maintenance (₹, if separate)</label>
              <input
                id="maintenanceCharge"
                type="number"
                min={0}
                value={form.maintenanceCharge}
                onChange={(e) => setForm((f) => ({ ...f, maintenanceCharge: e.target.value }))}
                className="input"
                placeholder="2000"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isRegistered"
                checked={form.isRegistered}
                onChange={(e) => setForm((f) => ({ ...f, isRegistered: e.target.checked }))}
                className="rounded border-slate-300 text-teal-600"
              />
              <label htmlFor="isRegistered" className="text-sm text-slate-700 dark:text-slate-300">
                Agreement will be registered (Sub-Registrar)
              </label>
            </div>

            <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
              {mutation.isPending ? (
                <><LoadingSpinner size="sm" className="mr-2" />Checking...</>
              ) : (
                'Check My Deposit'
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        <div>
          {mutation.error instanceof Error && (
            <div className="card p-5 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 text-sm">
              {mutation.error.message}
            </div>
          )}
          {result ? (
            <DepositResult result={result} onPrint={handlePrint} />
          ) : (
            <div className="card p-8 flex flex-col items-center justify-center text-center min-h-[300px] text-slate-500 dark:text-slate-400">
              <div className="text-5xl mb-4">💰</div>
              <p className="font-medium">Fill in the form to check your deposit</p>
              <p className="text-sm mt-2">We'll compare it against Bangalore market norms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
