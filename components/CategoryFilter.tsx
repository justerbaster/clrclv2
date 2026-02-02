'use client'

interface CategoryFilterProps {
  categories: string[]
  selected: string
  onChange: (category: string) => void
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`px-4 py-2 text-xs uppercase font-bold border-2 transition-all ${
          selected === 'all' 
            ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' 
            : 'bg-white text-[#1a1a2e] border-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white'
        }`}
      >
        All
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-4 py-2 text-xs uppercase font-bold border-2 transition-all ${
            selected === category 
              ? 'bg-[#4ECDC4] text-white border-[#4ECDC4]' 
              : 'bg-white text-[#1a1a2e] border-[#1a1a2e] hover:border-[#4ECDC4] hover:text-[#4ECDC4]'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
