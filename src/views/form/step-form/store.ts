import { fakeSubmitForm } from '@/api/form/step-form';
import { acceptHMRUpdate, defineStore } from 'pinia';
import type { PayType } from './typing';

export interface FormState {
  payAccount: string | undefined;
  receiverAccount: { type: PayType; number: string | number | undefined };
  receiverName: string;
  amount: number | string;
  [key: string]: any;
}

export interface StepFormState {
  step: FormState;
}

const initState = (): StepFormState => ({
  step: {
    payAccount: undefined,
    receiverAccount: {
      type: 'alipay',
      number: undefined,
    },
    receiverName: 'Sendya',
    amount: 500,
  },
});
export const useStepFormStore = defineStore('stepForm', {
  state: initState,
  getters: {
    payAccount: state => state.step.payAccount,
    receiverAccount: state => state.step.receiverAccount,
    receiverName: state => state.step.receiverName,
    amount: state => state.step.amount,
  },
  actions: {
    async submitStepForm(payload: FormState) {
      const res = await fakeSubmitForm(payload);
      if ((res as any).code) {
        this.step = {
          ...this.step,
          ...payload,
        };
        return Promise.resolve();
      }

      return Promise.reject('发生错误');
    },
    saveStepFormData(payload: FormState) {
      this.step = {
        ...this.step,
        ...payload,
      };
    },
    clear() {
      this.step = initState().step;
    },
  },
});

const hot = import.meta.webpackHot || (import.meta as any).hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useStepFormStore, hot));
}
