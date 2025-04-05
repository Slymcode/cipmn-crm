import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { ThemedTitleV2, useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp, Layout } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { customDataProvider } from "./providers/customDataProvider";
import { authProvider } from "./providers/auth";

import { Home, ForgotPassword, Login, Register } from "./pages";
import { Layout as AuthLayout } from "./components/layouts/auth/layout";
import { HomeLayout } from "./components/layouts/home/layout";
import {
  CreateMembership,
  EditMembership,
  List as MyList,
} from "./pages/membership";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AntdApp>
          <Refine
            Title={({ collapsed }) => (
              <ThemedTitleV2 collapsed={collapsed} text="MyApp" />
            )}
            dataProvider={customDataProvider}
            notificationProvider={useNotificationProvider}
            routerProvider={routerBindings}
            authProvider={authProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "u9pDTk-T9Mw1Q-CysV5s",
            }}
          >
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>
              <Route
                element={
                  <Authenticated
                    key="authenticated-layout"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }
              >
                <Route element={<HomeLayout />}>
                  <Route index element={<Home />} />
                  <Route path="/membership" element={<MyList />} />
                  <Route
                    path="/membership/create"
                    element={<CreateMembership />}
                  />
                  <Route
                    path="/membership/edit/:id"
                    element={<EditMembership />}
                  />
                </Route>
              </Route>
            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
