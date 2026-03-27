'use client';

import Link from 'next/link';
import { useCheckout } from '@/hooks/use-checkout';
import { CheckoutSteps } from '@/components/checkout/checkout-steps';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Lock, ShoppingCart } from 'lucide-react';

import { CheckoutAddressStep } from './checkout-address-step';
import { CheckoutPrescriptionStep } from './checkout-prescription-step';
import { CheckoutPaymentStep } from './checkout-payment-step';
import { CheckoutReviewStep } from './checkout-review-step';

export function CheckoutPageContent() {
  const checkout = useCheckout();

  // Loading state
  if (checkout.isAuthLoading || checkout.isLoadingPreview) {
    return (
      <div className="container-custom py-6 space-y-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
          <Skeleton className="h-60 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Auth gate
  if (!checkout.isAuthenticated) {
    return (
      <div className="container-custom py-12">
        <Card className="max-w-md mx-auto text-center" padding="lg">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Please log in to complete your purchase. Your cart items are saved.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button fullWidth>Log In</Button>
            </Link>
            <Link href="/shop">
              <Button fullWidth variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Empty cart
  if (!checkout.preview || checkout.preview.items.length === 0) {
    return (
      <div className="container-custom py-12">
        <EmptyState
          icon={<ShoppingCart className="h-12 w-12" />}
          title="Your cart is empty"
          description="Add some products to your cart before checking out."
          action={<Link href="/shop"><Button>Browse Products</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} className="mb-4" />

      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Steps indicator */}
      <CheckoutSteps
        steps={checkout.steps}
        currentStep={checkout.currentStep}
        className="mb-8"
      />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2">
          {checkout.currentStep === 'address' && (
            <CheckoutAddressStep
              userId={checkout.userId!}
              addresses={checkout.addresses}
              selectedAddressId={checkout.selectedAddressId}
              onSelect={checkout.setSelectedAddress}
              onAddAddress={checkout.addAddress}
              onContinue={checkout.goNext}
              canProceed={checkout.canProceed}
            />
          )}

          {checkout.currentStep === 'prescription' && (
            <CheckoutPrescriptionStep
              userId={checkout.userId!}
              prescriptionId={checkout.prescriptionId}
              onSetPrescription={checkout.setPrescriptionId}
              onContinue={checkout.goNext}
              onBack={checkout.goBack}
              canProceed={checkout.canProceed}
            />
          )}

          {checkout.currentStep === 'payment' && (
            <CheckoutPaymentStep
              paymentMethod={checkout.paymentMethod}
              senderNumber={checkout.senderNumber}
              transactionId={checkout.transactionId}
              onSelectMethod={checkout.setPaymentMethod}
              onSenderNumberChange={checkout.setSenderNumber}
              onTransactionIdChange={checkout.setTransactionId}
              onContinue={checkout.goNext}
              onBack={checkout.goBack}
              canProceed={checkout.canProceed}
            />
          )}

          {checkout.currentStep === 'review' && checkout.selectedAddress && (
            <CheckoutReviewStep
              preview={checkout.preview}
              selectedAddress={checkout.selectedAddress}
              paymentMethod={checkout.paymentMethod!}
              prescriptionId={checkout.prescriptionId}
              note={checkout.note}
              onNoteChange={checkout.setNote}
              onBack={checkout.goBack}
              onPlaceOrder={checkout.placeOrder}
              isPlacingOrder={checkout.isPlacingOrder}
              orderError={checkout.orderError}
            />
          )}
        </div>

        {/* Sidebar summary */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <CheckoutSummary preview={checkout.preview} />
          </div>
        </div>
      </div>
    </div>
  );
}
