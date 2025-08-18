import { Route, Routes } from "react-router-dom";
import { PATH } from "../../hooks/Path";
import DashboardLayout from "../../provider/DashboardLayout";
import {
  Calendar,
  Dashboard,
  DebtCreate,
  Debtor,
  DebtorCreate,
  DebtPayment,
  DebtSingle,
  Example,
  ExampleCreate,
  Message,
  MyProfile,
  Notification,
  Settings,
  SingleDebtor,
} from "../../pages";
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
              <Notification />
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
        <Route path={PATH.debtorCreate} element={<DebtorCreate />} />
        <Route path={PATH.singleDebtor} element={<SingleDebtor />} />
        <Route path={PATH.debtCreate} element={<DebtCreate />} />
        <Route path={PATH.debtorEdit} element={<DebtorCreate />} />
        <Route path={PATH.debtCreate} element={<DebtCreate />} />
        <Route path={PATH.debtUpdate} element={<DebtCreate />} />
        <Route path={PATH.debtSingle} element={<DebtSingle />} />
        <Route path={PATH.debtPayment} element={<DebtPayment />} />

        <Route
          path={PATH.notificationMessage}
          element={
            <Suspense fallback={<PageLoading />}>
              <Message />
            </Suspense>
          }
        />
        <Route path={PATH.me} element={<MyProfile />} />
        <Route path={PATH.example} element={<Example />} />
        <Route path={PATH.exampleCreate} element={<ExampleCreate />} />
        <Route path={PATH.exampleEdit} element={<ExampleCreate />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
