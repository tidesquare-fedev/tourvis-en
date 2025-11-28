import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Inquiry, InquiryReplyWithAdmin } from '@/types/admin';

interface InquiryState {
  // 문의 목록
  inquiries: Inquiry[];
  selectedInquiry: Inquiry | null;

  // 답변
  replies: Record<string, InquiryReplyWithAdmin[]>;

  // UI 상태
  isLoading: boolean;
  isConnected: boolean;
  searchTerm: string;
  filterStatus: string;
  filterType: string;

  // 액션
  setInquiries: (inquiries: Inquiry[]) => void;
  addInquiry: (inquiry: Inquiry) => void;
  updateInquiry: (id: string, updates: Partial<Inquiry>) => void;
  selectInquiry: (inquiry: Inquiry | null) => void;

  setReplies: (inquiryId: string, replies: InquiryReplyWithAdmin[]) => void;
  addReply: (inquiryId: string, reply: InquiryReplyWithAdmin) => void;

  setLoading: (loading: boolean) => void;
  setConnected: (connected: boolean) => void;
  setSearchTerm: (term: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterType: (type: string) => void;

  // 필터링된 문의 목록
  getFilteredInquiries: () => Inquiry[];

  // 통계
  getStats: () => {
    total: number;
    pending: number;
    answered: number;
    closed: number;
  };
}

export const useInquiryStore = create<InquiryState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        inquiries: [],
        selectedInquiry: null,
        replies: {},
        isLoading: false,
        isConnected: false,
        searchTerm: '',
        filterStatus: 'all',
        filterType: 'all',

        // 문의 관련 액션
        setInquiries: inquiries => set({ inquiries }),

        addInquiry: inquiry =>
          set(state => ({
            inquiries: [inquiry, ...state.inquiries],
          })),

        updateInquiry: (id, updates) =>
          set(state => ({
            inquiries: state.inquiries.map(inquiry =>
              inquiry.id === id ? { ...inquiry, ...updates } : inquiry,
            ),
            selectedInquiry:
              state.selectedInquiry?.id === id
                ? { ...state.selectedInquiry, ...updates }
                : state.selectedInquiry,
          })),

        selectInquiry: inquiry => set({ selectedInquiry: inquiry }),

        // 답변 관련 액션
        setReplies: (inquiryId, replies) =>
          set(state => ({
            replies: { ...state.replies, [inquiryId]: replies },
          })),

        addReply: (inquiryId, reply) =>
          set(state => ({
            replies: {
              ...state.replies,
              [inquiryId]: [...(state.replies[inquiryId] || []), reply],
            },
          })),

        // UI 상태 액션
        setLoading: loading => set({ isLoading: loading }),
        setConnected: connected => set({ isConnected: connected }),
        setSearchTerm: term => set({ searchTerm: term }),
        setFilterStatus: status => set({ filterStatus: status }),
        setFilterType: type => set({ filterType: type }),

        // 계산된 값들
        getFilteredInquiries: () => {
          const { inquiries, searchTerm, filterStatus, filterType } = get();

          return inquiries.filter(inquiry => {
            // 검색어 필터
            if (searchTerm) {
              const searchLower = searchTerm.toLowerCase();
              const matchesSearch =
                inquiry.subject.toLowerCase().includes(searchLower) ||
                inquiry.author.toLowerCase().includes(searchLower) ||
                inquiry.email.toLowerCase().includes(searchLower) ||
                inquiry.message.toLowerCase().includes(searchLower);

              if (!matchesSearch) return false;
            }

            // 상태 필터
            if (filterStatus !== 'all' && inquiry.status !== filterStatus) {
              return false;
            }

            // 타입 필터
            if (filterType !== 'all' && inquiry.category !== filterType) {
              return false;
            }

            return true;
          });
        },

        getStats: () => {
          const { inquiries } = get();
          return {
            total: inquiries.length,
            pending: inquiries.filter(i => i.status === 'pending').length,
            answered: inquiries.filter(i => i.status === 'answered').length,
            closed: inquiries.filter(i => i.status === 'closed').length,
          };
        },
      }),
      {
        name: 'inquiry-store',
        partialize: state => ({
          // 필요한 상태만 persist
          searchTerm: state.searchTerm,
          filterStatus: state.filterStatus,
          filterType: state.filterType,
        }),
      },
    ),
    {
      name: 'inquiry-store',
    },
  ),
);
