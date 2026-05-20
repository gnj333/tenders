export default function Loading() {
  return (
    <article className='mx-auto max-w-3xl px-4 py-12'>
      <div className='bg-muted mb-4 h-3 w-40 animate-pulse rounded' />
      <div className='bg-muted mb-2 h-8 w-3/4 animate-pulse rounded' />
      <div className='bg-muted mb-8 h-4 w-2/3 animate-pulse rounded' />
      <div className='border-border bg-muted mb-8 h-24 animate-pulse rounded border' />
      <div className='bg-muted mb-2 h-4 w-full animate-pulse rounded' />
      <div className='bg-muted h-4 w-5/6 animate-pulse rounded' />
    </article>
  );
}
