'use client';

import { useState, useEffect } from 'react';
import { Review, ReviewSummary } from '@/types';
import { reviewService } from '@/services/review';
import { useCurrentUser } from '@/hooks';
import { StarRating } from './star-rating';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { SectionHeader } from '@/components/ui/section-header';
import { BadgeCheck, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

function RatingSummary({ summary }: { summary: ReviewSummary }) {
  return (
    <div className="flex items-start gap-6">
      <div className="text-center">
        <p className="text-4xl font-bold text-foreground">{summary.averageRating}</p>
        <StarRating rating={summary.averageRating} size="sm" className="mt-1 justify-center" />
        <p className="text-xs text-muted-foreground mt-1">{summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}</p>
      </div>
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = summary.distribution[star] || 0;
          const pct = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-muted-foreground">{star}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-5 text-right text-muted-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="py-4 border-b border-border last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{review.userName}</span>
            {review.isVerifiedPurchase && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-secondary">
                <BadgeCheck className="h-3 w-3" /> Verified Purchase
              </span>
            )}
          </div>
          <StarRating rating={review.rating} size="sm" className="mt-1" />
        </div>
        <span className="text-[11px] text-muted-foreground shrink-0">{formatDate(review.createdAt)}</span>
      </div>
      <p className="text-sm font-medium text-foreground mt-2">{review.title}</p>
      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.comment}</p>
    </div>
  );
}

function ReviewForm({ productId, onSubmitted }: { productId: string; onSubmitted: () => void }) {
  const { userId, userName } = useCurrentUser();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating'); return; }
    if (!title.trim()) { setError('Please add a title'); return; }
    if (!comment.trim()) { setError('Please write a review'); return; }

    reviewService.addReview({
      productId,
      userId: userId || 'guest',
      userName: userName || 'Customer',
      rating,
      title: title.trim(),
      comment: comment.trim(),
    });

    setRating(0);
    setTitle('');
    setComment('');
    setError('');
    onSubmitted();
  };

  return (
    <Card padding="md">
      <h4 className="text-sm font-semibold mb-3">Write a Review</h4>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Rating</label>
          <StarRating rating={rating} size="lg" interactive onChange={setRating} />
        </div>
        <Input label="Title" placeholder="Summarize your experience" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea label="Review" placeholder="Share your experience with this medicine..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
        <Button type="submit" size="sm">Submit Review</Button>
      </form>
    </Card>
  );
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { isAuthenticated, userId } = useCurrentUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({ averageRating: 0, totalReviews: 0, distribution: {} });
  const [showForm, setShowForm] = useState(false);

  const loadReviews = () => {
    setReviews(reviewService.getProductReviews(productId));
    setSummary(reviewService.getReviewSummary(productId));
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const hasReviewed = userId ? reviewService.hasUserReviewed(productId, userId) : false;

  return (
    <div>
      <SectionHeader title="Customer Reviews" />

      {summary.totalReviews > 0 ? (
        <div className="grid md:grid-cols-[280px_1fr] gap-6 mt-4">
          {/* Summary */}
          <div>
            <Card padding="md">
              <RatingSummary summary={summary} />
            </Card>
            {isAuthenticated && !hasReviewed && (
              <Button
                variant="outline"
                fullWidth
                className="mt-3"
                onClick={() => setShowForm(!showForm)}
              >
                <MessageSquare className="h-4 w-4" />
                Write a Review
              </Button>
            )}
            {showForm && (
              <div className="mt-3">
                <ReviewForm
                  productId={productId}
                  onSubmitted={() => { loadReviews(); setShowForm(false); }}
                />
              </div>
            )}
          </div>

          {/* Review list */}
          <div>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      ) : (
        <Card className="mt-4 text-center" padding="lg">
          <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-3">No reviews yet for {productName}</p>
          {isAuthenticated ? (
            <>
              {!showForm ? (
                <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
                  Be the first to review
                </Button>
              ) : (
                <div className="max-w-md mx-auto mt-3">
                  <ReviewForm
                    productId={productId}
                    onSubmitted={() => { loadReviews(); setShowForm(false); }}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Sign in to leave a review</p>
          )}
        </Card>
      )}
    </div>
  );
}
