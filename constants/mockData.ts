/**
 * Mock Data for LMS Mobile App
 * Vietnamese language content
 */

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    enrolledCourses: string[];
}

export interface Instructor {
    id: string;
    name: string;
    avatar: string;
    title: string;
    bio: string;
    rating: number;
    studentCount: number;
}

export interface Lesson {
    id: string;
    title: string;
    duration: string;
    videoUrl: string;
    description: string;
    isCompleted: boolean;
    order: number;
}

export interface CourseSection {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Document {
    id: string;
    title: string;
    type: 'pdf' | 'slides' | 'code' | 'video';
    size: string;
    url: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface Quiz {
    id: string;
    title: string;
    duration: number; // minutes
    questions: QuizQuestion[];
    passingScore: number;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    instructor: Instructor;
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    rating: number;
    ratingCount: number;
    price: number;
    currency: string;
    sections: CourseSection[];
    documents: Document[];
    quiz?: Quiz;
    progress?: number;
    isEnrolled?: boolean;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
}

// Mock User
export const currentUser: User = {
    id: 'u1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    avatar: 'https://i.pravatar.cc/150?img=11',
    enrolledCourses: ['c1', 'c3', 'c5'],
};

// Mock Instructors
export const instructors: Instructor[] = [
    {
        id: 'i1',
        name: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=12',
        title: 'Senior Mobile Developer',
        bio: 'Hơn 8 năm kinh nghiệm phát triển ứng dụng di động với React Native và Flutter.',
        rating: 4.9,
        studentCount: 15420,
    },
    {
        id: 'i2',
        name: 'Sarah Chen',
        avatar: 'https://i.pravatar.cc/150?img=5',
        title: 'UI/UX Lead Designer',
        bio: 'Chuyên gia thiết kế giao diện người dùng với 10+ năm kinh nghiệm tại các công ty công nghệ lớn.',
        rating: 4.8,
        studentCount: 12350,
    },
    {
        id: 'i3',
        name: 'Michael Trần',
        avatar: 'https://i.pravatar.cc/150?img=8',
        title: 'Full Stack Developer',
        bio: 'Full stack developer với chuyên môn về Node.js, React và cloud computing.',
        rating: 4.7,
        studentCount: 9800,
    },
    {
        id: 'i4',
        name: 'Emily Ngô',
        avatar: 'https://i.pravatar.cc/150?img=9',
        title: 'Data Science Expert',
        bio: 'PhD về Machine Learning và AI, từng làm việc tại Google và Microsoft.',
        rating: 4.9,
        studentCount: 8500,
    },
];

// Mock Categories
export const categories: Category[] = [
    { id: 'cat1', name: 'Mobile', icon: 'phone-portrait', color: '#00D9FF' },
    { id: 'cat2', name: 'Frontend', icon: 'code-slash', color: '#FF6B6B' },
    { id: 'cat3', name: 'Backend', icon: 'server', color: '#4ECDC4' },
    { id: 'cat4', name: 'UI/UX', icon: 'color-palette', color: '#FFE66D' },
    { id: 'cat5', name: 'Data Science', icon: 'analytics', color: '#95E1D3' },
    { id: 'cat6', name: 'DevOps', icon: 'git-branch', color: '#AA96DA' },
];

// Mock Courses
export const courses: Course[] = [
    {
        id: 'c1',
        title: 'React Native Masterclass',
        description: 'Học cách xây dựng ứng dụng di động cross-platform chuyên nghiệp với React Native. Từ cơ bản đến nâng cao, bao gồm state management, navigation, và deployment.',
        thumbnail: 'https://picsum.photos/seed/rn1/400/300',
        instructor: instructors[0],
        category: 'Mobile',
        level: 'Advanced',
        duration: '40 giờ',
        rating: 4.9,
        ratingCount: 2340,
        price: 89.99,
        currency: 'USD',
        progress: 65,
        isEnrolled: true,
        sections: [
            {
                id: 's1',
                title: 'Giới thiệu React Native',
                lessons: [
                    { id: 'l1', title: 'Tổng quan về React Native', duration: '15:00', videoUrl: '', description: 'Tìm hiểu về React Native và lý do tại sao nên sử dụng nó.', isCompleted: true, order: 1 },
                    { id: 'l2', title: 'Cài đặt môi trường', duration: '20:00', videoUrl: '', description: 'Hướng dẫn cài đặt Node.js, React Native CLI và Android Studio.', isCompleted: true, order: 2 },
                    { id: 'l3', title: 'Dự án đầu tiên', duration: '25:00', videoUrl: '', description: 'Tạo ứng dụng Hello World đầu tiên.', isCompleted: false, order: 3 },
                ],
            },
            {
                id: 's2',
                title: 'Components và Styling',
                lessons: [
                    { id: 'l4', title: 'Core Components', duration: '30:00', videoUrl: '', description: 'Tìm hiểu về View, Text, Image và các component cơ bản.', isCompleted: false, order: 1 },
                    { id: 'l5', title: 'StyleSheet', duration: '25:00', videoUrl: '', description: 'Styling trong React Native với StyleSheet.', isCompleted: false, order: 2 },
                    { id: 'l6', title: 'Flexbox Layout', duration: '35:00', videoUrl: '', description: 'Sử dụng Flexbox để tạo layout responsive.', isCompleted: false, order: 3 },
                ],
            },
        ],
        documents: [
            { id: 'd1', title: 'React Native Cheat Sheet', type: 'pdf', size: '2.5 MB', url: '' },
            { id: 'd2', title: 'Slides bài giảng', type: 'slides', size: '15 MB', url: '' },
            { id: 'd3', title: 'Source code examples', type: 'code', size: '5 MB', url: '' },
        ],
        quiz: {
            id: 'q1',
            title: 'Kiểm tra React Native cơ bản',
            duration: 30,
            passingScore: 70,
            questions: [
                { id: 'qq1', question: 'React Native được phát triển bởi công ty nào?', options: ['Google', 'Facebook', 'Microsoft', 'Apple'], correctAnswer: 1 },
                { id: 'qq2', question: 'Component nào dùng để hiển thị text trong React Native?', options: ['View', 'Text', 'Label', 'Span'], correctAnswer: 1 },
                { id: 'qq3', question: 'Hook nào dùng để quản lý state trong functional component?', options: ['useEffect', 'useState', 'useContext', 'useReducer'], correctAnswer: 1 },
            ],
        },
    },
    {
        id: 'c2',
        title: 'UI/UX Design Fundamentals',
        description: 'Nắm vững nguyên tắc thiết kế giao diện người dùng và trải nghiệm người dùng. Học cách sử dụng Figma và các công cụ thiết kế chuyên nghiệp.',
        thumbnail: 'https://picsum.photos/seed/uiux2/400/300',
        instructor: instructors[1],
        category: 'UI/UX',
        level: 'Beginner',
        duration: '25 giờ',
        rating: 4.8,
        ratingCount: 1890,
        price: 69.99,
        currency: 'USD',
        progress: 0,
        isEnrolled: false,
        sections: [
            {
                id: 's3',
                title: 'Nguyên tắc thiết kế cơ bản',
                lessons: [
                    { id: 'l7', title: 'Màu sắc và Typography', duration: '20:00', videoUrl: '', description: 'Tìm hiểu về lý thuyết màu sắc và typography.', isCompleted: false, order: 1 },
                    { id: 'l8', title: 'Layout và Grid', duration: '25:00', videoUrl: '', description: 'Nguyên tắc thiết kế layout với grid system.', isCompleted: false, order: 2 },
                ],
            },
        ],
        documents: [
            { id: 'd4', title: 'UI Design Guidelines', type: 'pdf', size: '3 MB', url: '' },
        ],
    },
    {
        id: 'c3',
        title: 'Node.js Backend Development',
        description: 'Xây dựng REST API và backend services với Node.js, Express và MongoDB. Bao gồm authentication, security và deployment.',
        thumbnail: 'https://picsum.photos/seed/node3/400/300',
        instructor: instructors[2],
        category: 'Backend',
        level: 'Intermediate',
        duration: '35 giờ',
        rating: 4.7,
        ratingCount: 1560,
        price: 79.99,
        currency: 'USD',
        progress: 30,
        isEnrolled: true,
        sections: [
            {
                id: 's4',
                title: 'Node.js Cơ bản',
                lessons: [
                    { id: 'l9', title: 'Giới thiệu Node.js', duration: '15:00', videoUrl: '', description: 'Tổng quan về Node.js và event loop.', isCompleted: true, order: 1 },
                    { id: 'l10', title: 'NPM và Modules', duration: '20:00', videoUrl: '', description: 'Quản lý packages với NPM.', isCompleted: true, order: 2 },
                ],
            },
        ],
        documents: [
            { id: 'd5', title: 'Node.js Best Practices', type: 'pdf', size: '2 MB', url: '' },
        ],
    },
    {
        id: 'c4',
        title: 'Vue.js Frontend Framework',
        description: 'Làm chủ Vue.js 3 với Composition API, Vuex và Vue Router. Xây dựng SPA hiện đại và responsive.',
        thumbnail: 'https://picsum.photos/seed/vue4/400/300',
        instructor: instructors[2],
        category: 'Frontend',
        level: 'Intermediate',
        duration: '30 giờ',
        rating: 4.6,
        ratingCount: 980,
        price: 74.99,
        currency: 'USD',
        progress: 0,
        isEnrolled: false,
        sections: [],
        documents: [],
    },
    {
        id: 'c5',
        title: 'Machine Learning với Python',
        description: 'Nhập môn Machine Learning và Deep Learning với Python, TensorFlow và Scikit-learn. Xây dựng các model AI thực tế.',
        thumbnail: 'https://picsum.photos/seed/ml5/400/300',
        instructor: instructors[3],
        category: 'Data Science',
        level: 'Advanced',
        duration: '50 giờ',
        rating: 4.9,
        ratingCount: 2100,
        price: 99.99,
        currency: 'USD',
        progress: 15,
        isEnrolled: true,
        sections: [
            {
                id: 's5',
                title: 'Python cho Data Science',
                lessons: [
                    { id: 'l11', title: 'NumPy và Pandas', duration: '30:00', videoUrl: '', description: 'Xử lý dữ liệu với NumPy và Pandas.', isCompleted: true, order: 1 },
                    { id: 'l12', title: 'Data Visualization', duration: '25:00', videoUrl: '', description: 'Trực quan hóa dữ liệu với Matplotlib.', isCompleted: false, order: 2 },
                ],
            },
        ],
        documents: [
            { id: 'd6', title: 'ML Algorithms Cheat Sheet', type: 'pdf', size: '4 MB', url: '' },
            { id: 'd7', title: 'Python Data Science Handbook', type: 'pdf', size: '8 MB', url: '' },
        ],
    },
    {
        id: 'c6',
        title: 'Flutter App Development',
        description: 'Xây dựng ứng dụng di động đẹp mắt với Flutter và Dart. Từ widgets cơ bản đến state management nâng cao.',
        thumbnail: 'https://picsum.photos/seed/flutter6/400/300',
        instructor: instructors[0],
        category: 'Mobile',
        level: 'Beginner',
        duration: '35 giờ',
        rating: 4.8,
        ratingCount: 1750,
        price: 84.99,
        currency: 'USD',
        progress: 0,
        isEnrolled: false,
        sections: [],
        documents: [],
    },
];

// Helper functions
export const getEnrolledCourses = (): Course[] => {
    return courses.filter(course => currentUser.enrolledCourses.includes(course.id));
};

export const getCoursesByCategory = (categoryName: string): Course[] => {
    if (categoryName === 'All') return courses;
    return courses.filter(course => course.category === categoryName);
};

export const getCourseById = (id: string): Course | undefined => {
    return courses.find(course => course.id === id);
};

export const getFeaturedCourses = (): Course[] => {
    return courses.filter(course => course.rating >= 4.8);
};

export const getContinueLearning = (): Course[] => {
    return courses.filter(course => course.isEnrolled && course.progress && course.progress > 0 && course.progress < 100);
};
