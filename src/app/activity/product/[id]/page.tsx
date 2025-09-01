import { redirect } from 'next/navigation'

export default function ActivityProductRedirectPage({ params }: { params: { id?: string } }) {
  const id = params?.id
  if (!id) {
    redirect('/products')
  }
  redirect(`/tour/${encodeURIComponent(id)}`)
}
