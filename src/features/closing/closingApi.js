import { api } from '../../app/api.js';

const post = (url, body, method = 'POST') => ({ url, method, body });
const money = ['Summary', 'Appointments'];

export const closingApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSettings: build.query({ query: () => '/settings' }),
    getCurrentShift: build.query({ query: () => '/shifts/current', providesTags: ['Shift'] }),
    listShifts: build.query({ query: () => '/shifts?limit=20', providesTags: ['Shift'] }),
    openShift: build.mutation({ query: (b) => post('/shifts/open', b), invalidatesTags: ['Shift', ...money] }),
    closeShift: build.mutation({
      query: ({ id, ...b }) => post(`/shifts/${id}/close`, b),
      invalidatesTags: ['Shift', 'OnAccount', 'Goal', ...money],
    }),
    reopenShift: build.mutation({
      query: ({ id, ...b }) => post(`/shifts/${id}/reopen`, b),
      invalidatesTags: ['Shift', ...money],
    }),
    getClosingSummary: build.query({ query: (id) => `/shifts/${id}/closing-summary`, providesTags: ['Summary'] }),
    getAppointments: build.query({ query: (date) => `/appointments?date=${date}`, providesTags: ['Appointments'] }),
    createIncome: build.mutation({ query: (b) => post('/incomes', b), invalidatesTags: money }),
    uploadReceipt: build.mutation({
      query: (file) => {
        const body = new FormData();
        body.append('file', file);
        return post('/receipts', body);
      },
    }),
    getExpenseCategories: build.query({ query: () => '/expenses/categories' }),
    createExpense: build.mutation({ query: (b) => post('/expenses', b), invalidatesTags: ['Summary'] }),
    createAdvance: build.mutation({ query: (b) => post('/advances', b), invalidatesTags: ['Summary'] }),
    listOpenOnAccount: build.query({ query: () => '/on-account?status=OPEN', providesTags: ['OnAccount'] }),
    createOnAccount: build.mutation({ query: (b) => post('/on-account', b), invalidatesTags: ['OnAccount', ...money] }),
    settleOnAccount: build.mutation({
      query: ({ id, ...b }) => post(`/on-account/${id}/settle`, b),
      invalidatesTags: ['OnAccount', ...money],
    }),
    getGoal: build.query({ query: (month) => `/dashboard/goal?month=${month}`, providesTags: ['Goal'] }),
  }),
});

export const {
  useGetSettingsQuery, useGetCurrentShiftQuery, useListShiftsQuery, useOpenShiftMutation, useCloseShiftMutation,
  useReopenShiftMutation, useGetClosingSummaryQuery, useGetAppointmentsQuery, useCreateIncomeMutation,
  useUploadReceiptMutation, useGetExpenseCategoriesQuery, useCreateExpenseMutation, useCreateAdvanceMutation,
  useListOpenOnAccountQuery, useCreateOnAccountMutation, useSettleOnAccountMutation, useGetGoalQuery,
} = closingApi;
