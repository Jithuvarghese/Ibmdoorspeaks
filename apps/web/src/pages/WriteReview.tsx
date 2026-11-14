import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewSubmitSchema, type ReviewSubmit } from '@doorspeaks/shared';
import { searchLandlords, submitReview } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

type Step = 1 | 2 | 3 | 4;

const RATING_FIELDS = [
  { name: 'ratings.maintenance' as const, label: 'Maintenance' },
  { name: 'ratings.depositReturn' as const, label: 'Deposit Return' },
  { name: 'ratings.privacyRespect' as const, label: 'Privacy Respect' },
  { name: 'ratings.rentIncreaseFairness' as const, label: 'Rent Increase Fairness' },
  { name: 'ratings.communication' as const, label: 'Communication' },
];

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="group">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${star} star`}
          className={`text-2xl transition-colors ${(hover || value) >= star ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function WriteReview() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState<Step>(1);
  const [isNewLandlord, setIsNewLandlord] = useState(!sp.get('landlordId'));

  const { data: landlordData } = useQuery({
    queryKey: ['landlords', 'all'],
    queryFn: () => searchLandlords({ page: 1 }),
    staleTime: 60_000,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewSubmit>({
    resolver: zodResolver(ReviewSubmitSchema),
    defaultValues: {
      landlordId: sp.get('landlordId') ?? undefined,
      anonymous: false,
      wouldRentAgain: true,
      ratings: {
        maintenance: 3,
        depositReturn: 3,
        privacyRespect: 3,
        rentIncreaseFairness: 3,
        communication: 3,
      },
    },
  });

  const mutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['landlords'] });
      setStep(4);
    },
  });

  const onSubmit = (data: ReviewSubmit) => {
    mutation.mutate(data);
  };

  const ratings = watch('ratings');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Write a Review</h1>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
        Help other tenants by sharing your honest experience. Reviews must be based on personal experience.
      </p>

      {/* Legal notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 text-sm text-amber-800 dark:text-amber-300">
        ⚠️ Please ensure your review is honest, based on personal experience, and does not contain personal contact information (phone numbers, emails, Aadhaar numbers). Reviews go through moderation before publication.
      </div>

      {/* Progress */}
      {step < 4 && (
        <div className="flex items-center gap-2 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-teal-700 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'}`}>
                {s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 w-8 transition-colors ${step > s ? 'bg-teal-700' : 'bg-slate-200 dark:bg-slate-600'}`} />}
            </div>
          ))}
          <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
            Step {step} of 3
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Landlord + property */}
        {step === 1 && (
          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 dark:text-white">1. About the Landlord & Property</h2>

            <div>
              <label className="label">Landlord</label>
              <div className="flex gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setIsNewLandlord(false)}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${!isNewLandlord ? 'bg-teal-700 text-white border-teal-700' : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  Existing landlord
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewLandlord(true)}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${isNewLandlord ? 'bg-teal-700 text-white border-teal-700' : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  New landlord
                </button>
              </div>

              {isNewLandlord ? (
                <div>
                  <label className="label" htmlFor="newLandlordName">Landlord name</label>
                  <input
                    id="newLandlordName"
                    {...register('newLandlordName')}
                    className="input"
                    placeholder="e.g. Ramesh Sharma"
                  />
                  {errors.newLandlordName && <p className="text-red-500 text-xs mt-1">{errors.newLandlordName.message}</p>}
                </div>
              ) : (
                <div>
                  <label className="label" htmlFor="landlordId">Select landlord</label>
                  <select id="landlordId" {...register('landlordId')} className="input">
                    <option value="">Select a landlord...</option>
                    {landlordData?.data.map((l) => (
                      <option key={l.id} value={l.id}>{l.name} ({l.localities.slice(0, 2).join(', ')})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="locality">Locality</label>
                <input id="locality" {...register('locality')} className="input" placeholder="e.g. Koramangala" />
                {errors.locality && <p className="text-red-500 text-xs mt-1">{errors.locality.message}</p>}
              </div>
              <div>
                <label className="label" htmlFor="bhk">BHK</label>
                <select id="bhk" {...register('bhk', { valueAsNumber: true })} className="input">
                  <option value={1}>1 BHK</option>
                  <option value={2}>2 BHK</option>
                  <option value={3}>3 BHK</option>
                  <option value={4}>4+ BHK</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="tenancyStart">Tenancy start</label>
                <input type="date" id="tenancyStart" {...register('tenancyStart')} className="input" />
                {errors.tenancyStart && <p className="text-red-500 text-xs mt-1">{errors.tenancyStart.message}</p>}
              </div>
              <div>
                <label className="label" htmlFor="tenancyEnd">Tenancy end (if past)</label>
                <input type="date" id="tenancyEnd" {...register('tenancyEnd')} className="input" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="rentPerMonth">Monthly rent (₹)</label>
                <input type="number" id="rentPerMonth" {...register('rentPerMonth', { valueAsNumber: true })} className="input" placeholder="25000" />
                {errors.rentPerMonth && <p className="text-red-500 text-xs mt-1">{errors.rentPerMonth.message}</p>}
              </div>
            </div>

            <button type="button" onClick={() => setStep(2)} className="btn-primary w-full">
              Next: Ratings →
            </button>
          </div>
        )}

        {/* Step 2: Ratings + deposit */}
        {step === 2 && (
          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 dark:text-white">2. Ratings & Deposit</h2>

            {RATING_FIELDS.map((f) => (
              <div key={f.name}>
                <label className="label">{f.label}</label>
                <StarInput
                  value={f.name === 'ratings.maintenance' ? ratings.maintenance
                    : f.name === 'ratings.depositReturn' ? ratings.depositReturn
                    : f.name === 'ratings.privacyRespect' ? ratings.privacyRespect
                    : f.name === 'ratings.rentIncreaseFairness' ? ratings.rentIncreaseFairness
                    : ratings.communication}
                  onChange={(v) => setValue(f.name, v)}
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="depositAmount">Deposit paid (₹)</label>
                <input type="number" id="depositAmount" {...register('depositAmount', { valueAsNumber: true })} className="input" placeholder="100000" />
              </div>
              <div>
                <label className="label" htmlFor="depositReturned">Deposit returned (₹)</label>
                <input type="number" id="depositReturned" {...register('depositReturned', { valueAsNumber: true })} className="input" placeholder="100000" />
                <p className="text-xs text-slate-500 mt-1">0 if not yet returned or tenancy ongoing</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
              <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">Next: Your Experience →</button>
            </div>
          </div>
        )}

        {/* Step 3: Text review */}
        {step === 3 && (
          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 dark:text-white">3. Your Experience</h2>

            <div>
              <label className="label" htmlFor="freeText">Your review (50–2000 characters)</label>
              <textarea
                id="freeText"
                {...register('freeText')}
                rows={6}
                className="input resize-none"
                placeholder="Share your honest experience as a tenant. What was the landlord like? Were there any issues with maintenance, the deposit, or communication?"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{errors.freeText ? <span className="text-red-500">{errors.freeText.message}</span> : ''}</span>
                <span>{watch('freeText')?.length ?? 0}/2000</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="anonymous" {...register('anonymous')} className="rounded border-slate-300 text-teal-600" />
              <label htmlFor="anonymous" className="text-sm text-slate-700 dark:text-slate-300">Post anonymously</label>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="wouldRentAgain" {...register('wouldRentAgain')} className="rounded border-slate-300 text-teal-600" />
              <label htmlFor="wouldRentAgain" className="text-sm text-slate-700 dark:text-slate-300">I would rent from this landlord again</label>
            </div>

            {mutation.error instanceof Error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-4 text-sm">
                {mutation.error.message}
              </div>
            )}

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">← Back</button>
              <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1">
                {mutation.isPending ? <><LoadingSpinner size="sm" className="mr-2" />Submitting...</> : 'Submit Review'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="card p-10 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Review Submitted!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Thank you for your contribution. Your review will appear after moderation (usually within 24 hours).
            </p>
            <div className="flex justify-center gap-3">
              <button type="button" onClick={() => navigate('/landlords')} className="btn-primary">Browse Landlords</button>
              <button type="button" onClick={() => { setStep(1); mutation.reset(); }} className="btn-secondary">Write Another</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
