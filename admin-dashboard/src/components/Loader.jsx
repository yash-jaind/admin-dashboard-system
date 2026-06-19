export default function Loader({ size = 'md' }) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3'
  }

  return (
    <div className="flex items-center justify-center w-full py-10">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-primary-500 border-t-transparent`}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}
