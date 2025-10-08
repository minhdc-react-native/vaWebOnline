import { DynamicIcon } from "lucide-react/dynamic"

const mapIcon = {
    'address-book': 'book-user',
    'money': 'dollar-sign',
    'address-card-o': 'id-card',
    'handshake-o': 'handshake',
    'cogs': 'cog'
}

interface AppCardProps {
    name: string
    color: string
    icon: string
    onClick?: () => void
}

export function AppCard({ name, color, icon, onClick }: AppCardProps) {
    return (
        <div className="flex flex-col items-center gap-1">
            <button
                onClick={onClick}
                style={{ backgroundColor: color }}
                className="
                        group
                        relative
                        flex flex-col items-center justify-center
                        w-28 h-28 rounded-2xl text-white
                        shadow-md hover:shadow-xl
                        transition-all duration-300
                        hover:scale-105
                    "
            >
                <span
                    className="
                    absolute inset-0 rounded-2xl
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                    bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35),transparent_70%)]
                    ring-2 ring-white/60
                    shadow-[0_0_15px_rgba(255,255,255,0.5)]
                    blur-[2px]
                    "
                ></span>
                <DynamicIcon name={(mapIcon as any)[icon.trim()] || icon} size={50} />
            </button>
            <span className="text-md font-semibold">{name}</span>
        </div>
    )
}
