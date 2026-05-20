export default function Loading() {
  return (
    <section className='mx-auto max-w-6xl px-4 py-12'>
      <div className='bg-muted mb-2 h-8 w-40 animate-pulse rounded' />
      <div className='bg-muted mb-8 h-4 w-72 animate-pulse rounded' />
      <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className='border-border bg-card h-40 animate-pulse rounded-lg border' />
        ))}
      </ul>
    </section>
  );
}
