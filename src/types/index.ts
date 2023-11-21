import { ReactNode } from 'react';

export interface MenuProps {
    name: string,
    menus: MenuItemProps[]
}

export interface MenuItemProps {
    name: string;
    path: string;
    icon: ReactNode;
    active?: string[] | string | any;
    menus?: MenuItemProps[]
}

export interface FacultiesProps {
    id: number;
    name: string;
    Streams: StreamsProps[]
}

export interface StreamsProps {
    id: number;
    streamName: string;
}

export interface StateProps {
    id: number;
    name: string;
}

export interface InstituteFacultiesProps {
    facultyId: number;
    name: string;
}
export interface InstituteStreamProps {
    facultyId: number;
    streamId: number;
    streamName: string;
}
export interface InstituteClassProps {
    classId: number;
    className: string;
}
export interface InstituteSubjectProps {
    id: number,
    subjectName: string,
    subjectShortName: string
}

export interface ClassProps {
    id: number;
    className: string;
}
export interface DivisionProps {
    id: number;
    name: string;
}

export interface UserDetailsProps {
    avtarUrl: string,
    id: number,
    userTypeId: number,
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
    dob: string,
    gender: string,
    bloodGroup: string,
    bio: string,
    hobbies: string[],
    skills: string[],
    achievements: string[],
    connections: 1,
    teacher?: {
        id: number,
        instituteId: number,
        instituteFacultyId: number,
        instituteName: string,
        instituteUsername: string,
        facultyName: string
    },
    student?: {
        id: number,
        instituteId: number,
        instituteFacultyId: number,
        instituteName: string,
        instituteUsername: string,
        facultyName: string
    }
}

export interface CultureProps {
    id: number,
    title: string,
    cultureDate: string,
    startTime: string,
    endTime: string,
    desc: string,
    createdAt: string
}

export interface CanteenItemProps {
    itemAvtarUrl: string;
    id: number,
    itemType: number,
    itemName: string,
    price: number,
    createdAt: string
}

export interface CommentProps {
    id: number,
    comment: string,
    userId: number,
    name: string,
    username: string,
    isMyComment: number,
    createdAt: string,
    user: {
        avtarUrl: string

    }
}

export interface PostProps {
    id: number,
    title: string,
    desc: string,
    name: string,
    username: string,
    likes: number,
    instituteName: string,
    comments: number,
    isMyPost: number,
    isLiked: number,
    createdAt: string,
    photos: [
        {
            pathUrl: string
        }
    ]
}

export interface InstituteProps {
    avtarUrl: string,
    id: number,
    userName: string,
    email: string,
    mobile: string,
    address: string,
    stateId: number,
    createdAt: string,
    instituteName: string,
    bio: string,
    institute: {
        bannerPath: string,
        brochurePath: string,
        id: number,
        website: string,
        aboutUs: string,
        policy: string,
        deanId: number,
        deanEducation: string,
        assignDeanDate: string,
        desc: string,
        createdAt: string,
        instituteRating: number,
        placementRating: number,
        staffRating: number,
        teachingRating: number,
        environmentRating: number,
        dean: {
            id: number,
            name: string,
        }
    }
}

export interface EntranceExamsProps {
    id: number,
    instituteFacultyId: number,
    entranceName: string,
    examLink: string,
    merit: string,
    createdAt: string
}

export interface FacilityProps {
    id: number,
    title: string,
    desc: string,
    createdAt: string
}
export interface CompanyProps {
    id: number,
    companyLogo: string,
    companyName: string,
    createdAt: string
}
export interface PlaceStudentProps {
    studentAvtar: string,
    id: number,
    package: string,
    createdAt: string,
    studentName: string,
    companyName: string
}

export interface InstituteFeesProps {
    instituteFacultyId: number,
    faculty: string,
    stream: string,
    className: string,
    instituteStreamId: number,
    instituteClassId: number,
    fees: FeesProps[]
}

export interface FeesProps {
    id: number,
    fees: string,
    caste: string
}

export interface GalleryProps {
    id: number,
    photoPath: string,
}

export interface StudentReportCardProps {
    reportCardUrl: string;
    id: number,
    instituteStreamClassId: number
}

export interface StudentProps {
    statusString: string,
    id: number,
    userId: number,
    instituteFacultyId: number,
    instituteStreamId: number,
    status: number,
    name: string,
    faculty: string,
    stream: string,
    className: number,
    createdAt: string,
    User: {
        avtarUrl: string
    }
}

export interface TeacherProps {
    statusString: string,
    id: number,
    userId: number,
    instituteFacultyId: number,
    instituteStreamId: number,
    status: number,
    name: string,
    faculty: string,
    stream: string,
    createdAt: string
}

export interface TimeTableProps {
    id: number,
    scheduleDate: string,
    scheduleDays: string,
    startTime: string,
    endTime: string,
    desc: string,
    createdAt: string,
    subjectName: string,
    subjectShortName: string,
    teacherAvtarUrl: string,
    teacherName: string,
}

export interface ExhibitionProps {
    id: number,
    desc: string,
    createdAt: string,
    title: string,
    name: string,
    studentUserName: string,
    photos: ExhibitionPhotoProps[],
    avtarUrl: string
}

export interface ExhibitionPhotoProps {
    picUrl: string,
    id: number
}

export interface ExamTypes {
    id: number;
    name: string;
}

export interface BookProps {
    thumbnailUrl: string,
    pdfUrl: string,
    id: number,
    bookCategoryId: number,
    name: string,
    writerName: string,
    bookUrl: string,
    createdAt: string,
    facultyId: number,
    streamId: number,
    classId: number,
    language: string,
    bookCategoryName: string
}