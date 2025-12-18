import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../modules/auth/slices/authSlice'
import complaintsReducer from '../../modules/complaints/slices/complaintsSlice'
import citizensReducer from '../../modules/citizens/slices/citizensSlice'
import dashboardReducer from '../../modules/dashboard/slices/dashboardSlice'
import governmentAgenciesReducer from '../../modules/governmentagency/slices/governmentAgenciesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintsReducer,
    citizens: citizensReducer,
    dashboard: dashboardReducer,
    governmentAgencies: governmentAgenciesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

