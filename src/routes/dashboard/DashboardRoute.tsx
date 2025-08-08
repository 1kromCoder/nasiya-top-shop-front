import { Route, Routes } from "react-router-dom";
import { PATH } from "../../hooks/Path";
import DashboardLayout from "../../provider/DashboardLayout";
import { Calendar, Dashboard, Debtor, Hisobot, Settings } from "../../pages";
import { Suspense } from "react";
import { PageLoading } from "../../components";

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route
          path={PATH.main}
          element={
            <Suspense fallback={<PageLoading />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route path={PATH.calendar} element={<Calendar />} />
        <Route
          path={PATH.mijoz}
          element={
            <Suspense fallback={<PageLoading />}>
              <Debtor />
            </Suspense>
          }
        />
        <Route
          path={PATH.hisobot}
          element={
            <Suspense fallback={<PageLoading />}>
              <Hisobot />
            </Suspense>
          }
        />
        <Route
          path={PATH.sozlama}
          element={
            <Suspense fallback={<PageLoading />}>
              <Settings />
            </Suspense>
          }
        />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
