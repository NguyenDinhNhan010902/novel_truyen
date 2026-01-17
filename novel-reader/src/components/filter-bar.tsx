'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCategories } from '@/lib/api';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

export function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [categories, setCategories] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false); // Mobile toggle state

    // State for filters
    const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
    const [category, setCategory] = useState(searchParams.get('category') || 'ALL');
    const [sort, setSort] = useState(searchParams.get('sort') || 'latest');
    const [minChapter, setMinChapter] = useState(searchParams.get('min_c') || '');

    useEffect(() => {
        // Fetch categories for dropdown
        getCategories().then(setCategories);
    }, []);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (status && status !== 'ALL') params.set('status', status);
        else params.delete('status');

        if (category && category !== 'ALL') params.set('category', category);
        else params.delete('category');

        if (sort) params.set('sort', sort);

        if (minChapter) params.set('min_c', minChapter);
        else params.delete('min_c');

        router.push(`/tim-kiem?${params.toString()}`);
        setIsOpen(false); // Close on apply (mobile)
    };

    const handleReset = () => {
        setStatus('ALL');
        setCategory('ALL');
        setSort('latest');
        setMinChapter('');
        router.push('/tim-kiem');
        setIsOpen(false);
    };

    const selectClass = "flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-[#13131a] px-3 py-2 text-sm text-gray-300 ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <div className="bg-[#1c1c24] p-4 rounded-xl border border-white/5 mb-6">
            {/* Mobile Toggle Header */}
            <div className="flex items-center justify-between md:hidden" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-2 text-white font-medium">
                    <Filter className="h-4 w-4 text-indigo-500" />
                    Bộ lọc tìm kiếm
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white p-0 h-auto"
                >
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
            </div>

            {/* Filter Content (Hidden on Mobile unless Open, Always visible on Desktop) */}
            <div className={`mt-4 space-y-4 md:mt-0 md:space-y-0 md:flex md:items-end md:gap-4 ${isOpen ? 'block' : 'hidden md:flex'}`}>
                {/* Category */}
                <div className="flex-1 space-y-1.5">
                    <label className="text-xs text-gray-400 font-medium">Thể loại</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={selectClass}
                    >
                        <option value="ALL">Tất cả</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.slug}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div className="w-full md:w-40 space-y-1.5">
                    <label className="text-xs text-gray-400 font-medium">Trạng thái</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={selectClass}
                    >
                        <option value="ALL">Tất cả</option>
                        <option value="ONGOING">Đang ra</option>
                        <option value="COMPLETED">Hoàn thành</option>
                        <option value="PAUSED">Tạm dừng</option>
                    </select>
                </div>

                {/* Sort */}
                <div className="w-full md:w-40 space-y-1.5">
                    <label className="text-xs text-gray-400 font-medium">Sắp xếp</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className={selectClass}
                    >
                        <option value="latest">Mới cập nhật</option>
                        <option value="views">Xem nhiều nhất</option>
                        <option value="az">Tên A-Z</option>
                        <option value="oldest">Cũ nhất</option>
                    </select>
                </div>

                {/* Min Chapter */}
                <div className="w-full md:w-32 space-y-1.5">
                    <label className="text-xs text-gray-400 font-medium">Số chương &gt;</label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={minChapter}
                        onChange={(e) => setMinChapter(e.target.value)}
                        className="bg-[#13131a] border-white/10 text-gray-300"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2 md:pt-0">
                    <Button onClick={handleApply} className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto">Lọc</Button>
                    <Button onClick={handleReset} variant="outline" className="border-white/10 text-gray-400 hover:bg-white/5 hover:text-white w-full md:w-auto">Xóa</Button>
                </div>
            </div>
        </div>
    );
}
