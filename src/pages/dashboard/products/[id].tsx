import { useParams } from 'react-router-dom'

export default function ProductDetailPage() {
  const { id } = useParams()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Product #{id}</h1>
        <p className="text-muted-foreground mt-1">View and edit product details</p>
      </div>
      <div className="bg-card rounded-lg p-8 border border-border">
        <p className="text-muted-foreground">Product details will go here</p>
      </div>
    </div>
  )
}
