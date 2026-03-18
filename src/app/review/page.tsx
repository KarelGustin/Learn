import { getDueReviews, getReviewStats } from "@/services/review"
import { Card, CardContent } from "@/components/ui/card"
import { RotateCcw, CheckCircle } from "lucide-react"
import { ReviewSession } from "@/components/review/review-session"

export default async function ReviewPage() {
  const [dueReviews, stats] = await Promise.all([
    getDueReviews(20),
    getReviewStats(),
  ])

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50 flex items-center gap-3">
          <RotateCcw className="h-8 w-8 text-yellow-400" />
          Review Center
        </h1>
        <p className="text-zinc-400 mt-1">Spaced repetition to solidify your knowledge</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{stats.due}</p>
            <p className="text-xs text-zinc-400">Due now</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-zinc-50">{stats.total}</p>
            <p className="text-xs text-zinc-400">Total items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{stats.avgEfactor}</p>
            <p className="text-xs text-zinc-400">Avg easiness</p>
          </CardContent>
        </Card>
      </div>

      {/* Review Session */}
      {dueReviews.length > 0 ? (
        <ReviewSession reviews={dueReviews} />
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-50 mb-2">All caught up!</h3>
            <p className="text-zinc-400">No reviews due right now. Keep learning to add more review items.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
