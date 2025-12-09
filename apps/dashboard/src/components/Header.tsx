import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  ClipboardType,
  Database,
  Home,
  Menu,
  Network,
  SquareFunction,
  StickyNote,
  X,
} from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

  return (
    <>
      <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-3xl font-light tracking-wide">
          <a
            href="https://raus.cloud"
            className="text-white hover:text-gray-300 transition-colors"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            raus.cloud
          </a>
        </h1>
      </header>
    </>
  )
}
