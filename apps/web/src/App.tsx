import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const LandlordsPage = lazy(() => import('./pages/LandlordsPage'));
const LandlordDetail = lazy(() => import('./pages/LandlordDetail'));
const WriteReview = lazy(() => import('./pages/WriteReview'));
const DepositCheck = lazy(() => import('./pages/DepositCheck'));
const RightsHub = lazy(() => import('./pages/RightsHub'));
const RightsArticle = lazy(() => import('./pages/RightsArticle'));
const LocalitiesPage = lazy(() => import('./pages/LocalitiesPage'));
const LocalityDetail = lazy(() => import('./pages/LocalityDetail'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/landlords" element={<LandlordsPage />} />
          <Route path="/landlords/:id" element={<LandlordDetail />} />
          <Route path="/write-review" element={<WriteReview />} />
          <Route path="/deposit-check" element={<DepositCheck />} />
          <Route path="/rights" element={<RightsHub />} />
          <Route path="/rights/:slug" element={<RightsArticle />} />
          <Route path="/localities" element={<LocalitiesPage />} />
          <Route path="/localities/:slug" element={<LocalityDetail />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
