'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Address, PaymentMethod, OrderPreview, Order } from '@/types';
import { addressService } from '@/services/address';
import { checkoutService } from '@/services/checkout';
import { cartService } from '@/services/cart';
import { useCurrentUser } from './use-current-user';

export type CheckoutStep = 'address' | 'prescription' | 'payment' | 'review';

interface CheckoutState {
  currentStep: CheckoutStep;
  addresses: Address[];
  selectedAddressId: string | null;
  prescriptionId: string | null;
  paymentMethod: PaymentMethod | null;
  senderNumber: string;
  transactionId: string;
  couponCode: string;
  note: string;
  preview: OrderPreview | null;
  isLoadingPreview: boolean;
  isLoadingAddresses: boolean;
  isPlacingOrder: boolean;
  orderError: string | null;
}

export function useCheckout() {
  const { userId, isAuthenticated, isLoading: isAuthLoading } = useCurrentUser();

  const [state, setState] = useState<CheckoutState>({
    currentStep: 'address',
    addresses: [],
    selectedAddressId: null,
    prescriptionId: null,
    paymentMethod: null,
    senderNumber: '',
    transactionId: '',
    couponCode: '',
    note: '',
    preview: null,
    isLoadingPreview: true,
    isLoadingAddresses: true,
    isPlacingOrder: false,
    orderError: null,
  });

  // Load preview
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const preview = await cartService.computeOrderPreview();
        if (!cancelled) setState((s) => ({ ...s, preview, isLoadingPreview: false }));
      } catch {
        if (!cancelled) setState((s) => ({ ...s, isLoadingPreview: false }));
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Load addresses
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    async function load() {
      try {
        const addresses = await addressService.getAddresses(userId!);
        if (cancelled) return;
        const defaultAddr = addresses.find((a) => a.isDefault);
        setState((s) => ({
          ...s,
          addresses,
          selectedAddressId: defaultAddr?.id || addresses[0]?.id || null,
          isLoadingAddresses: false,
        }));
      } catch {
        if (!cancelled) setState((s) => ({ ...s, isLoadingAddresses: false }));
      }
    }
    load();
    return () => { cancelled = true; };
  }, [userId]);

  // Steps (dynamic based on Rx items)
  const steps = useMemo(() => {
    const list: { id: CheckoutStep; label: string }[] = [
      { id: 'address', label: 'Address' },
    ];
    if (state.preview?.hasPrescriptionItems) {
      list.push({ id: 'prescription', label: 'Prescription' });
    }
    list.push({ id: 'payment', label: 'Payment' });
    list.push({ id: 'review', label: 'Review' });
    return list;
  }, [state.preview?.hasPrescriptionItems]);

  const currentStepIndex = steps.findIndex((s) => s.id === state.currentStep);

  const goNext = useCallback(() => {
    setState((s) => {
      const idx = steps.findIndex((st) => st.id === s.currentStep);
      if (idx < steps.length - 1) {
        return { ...s, currentStep: steps[idx + 1].id, orderError: null };
      }
      return s;
    });
  }, [steps]);

  const goBack = useCallback(() => {
    setState((s) => {
      const idx = steps.findIndex((st) => st.id === s.currentStep);
      if (idx > 0) {
        return { ...s, currentStep: steps[idx - 1].id, orderError: null };
      }
      return s;
    });
  }, [steps]);

  const goToStep = useCallback((step: CheckoutStep) => {
    setState((s) => ({ ...s, currentStep: step, orderError: null }));
  }, []);

  const setSelectedAddress = useCallback((id: string) => {
    setState((s) => ({ ...s, selectedAddressId: id }));
  }, []);

  const addAddress = useCallback((address: Address) => {
    setState((s) => ({
      ...s,
      addresses: [...s.addresses, address],
      selectedAddressId: address.id,
    }));
  }, []);

  const setPrescriptionId = useCallback((id: string) => {
    setState((s) => ({ ...s, prescriptionId: id }));
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setState((s) => ({ ...s, paymentMethod: method, senderNumber: '', transactionId: '' }));
  }, []);

  const setSenderNumber = useCallback((value: string) => {
    setState((s) => ({ ...s, senderNumber: value }));
  }, []);

  const setTransactionId = useCallback((value: string) => {
    setState((s) => ({ ...s, transactionId: value }));
  }, []);

  const setNote = useCallback((value: string) => {
    setState((s) => ({ ...s, note: value }));
  }, []);

  const selectedAddress = state.addresses.find((a) => a.id === state.selectedAddressId) || null;

  const canProceed = useMemo(() => {
    switch (state.currentStep) {
      case 'address':
        return !!state.selectedAddressId;
      case 'prescription':
        return !!state.prescriptionId;
      case 'payment':
        if (!state.paymentMethod) return false;
        if (state.paymentMethod !== PaymentMethod.COD) {
          return state.senderNumber.length >= 11 && state.transactionId.length >= 4;
        }
        return true;
      case 'review':
        return true;
      default:
        return false;
    }
  }, [state]);

  // Not wrapped in useCallback — depends on entire state, so caching provides no benefit
  const placeOrder = async (): Promise<Order | null> => {
    if (!userId || !state.preview || !selectedAddress) return null;

    setState((s) => ({ ...s, isPlacingOrder: true, orderError: null }));
    try {
      const order = await checkoutService.placeOrder({
        userId,
        items: state.preview.items,
        shippingAddress: selectedAddress,
        paymentMethod: state.paymentMethod!,
        prescriptionId: state.prescriptionId || undefined,
        couponCode: state.couponCode || undefined,
        note: state.note || undefined,
        senderNumber: state.senderNumber || undefined,
        transactionId: state.transactionId || undefined,
      });
      setState((s) => ({ ...s, isPlacingOrder: false }));
      return order;
    } catch (err: any) {
      setState((s) => ({ ...s, isPlacingOrder: false, orderError: err.message || 'Failed to place order' }));
      return null;
    }
  };

  return {
    ...state,
    selectedAddress,
    steps,
    currentStepIndex,
    canProceed,
    isAuthenticated,
    isAuthLoading,
    userId,
    goNext,
    goBack,
    goToStep,
    setSelectedAddress,
    addAddress,
    setPrescriptionId,
    setPaymentMethod,
    setSenderNumber,
    setTransactionId,
    setNote,
    placeOrder,
  };
}
