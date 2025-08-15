interface ProgressBarProps {
    currentStep: number
    totalSteps: number
    labels?: string[]
}

export function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
    const percentage = (currentStep / totalSteps) * 100

    return (
        <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-2 bg-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {labels && labels.length > 0 && (
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                    {labels.map((label, index) => (
                        <span
                            key={label}
                            className={currentStep === index + 1 ? 'text-blue-600 font-medium' : ''}
                        >
                            {label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}