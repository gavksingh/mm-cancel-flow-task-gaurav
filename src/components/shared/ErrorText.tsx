export function ErrorText({ message, className = "" }: { message: string; className?: string }) {
    if (!message) return null
    return (
        <p className={`text-sm text-red-600 mt-2 transition-colors ${className}`}>
            {message}
        </p>
    )
}
