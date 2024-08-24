import { library } from '@fortawesome/fontawesome-svg-core'
import { solid } from '../assets/icons/solids'
import { regulars } from '../assets/icons/regulars'
import { brands } from '../assets/icons/brands'
export default {
    install(){
        library.add(
            solid.faBars,
            solid.faUser,
            solid.faLock,
            solid.faEnvelope,
            solid.faVideo,
            solid.faMagnifyingGlass,
            solid.faPhone,
            solid.faSquarePhoneFlip,
            solid.faPaperPlane,
            solid.faCaretLeft,
            solid.faMessage,
            solid.faBoxArchive,
            solid.faShop,
            solid.faCartShopping,
            solid.faUserPlus,
            solid.faRectangleXmark,
            solid.faPeopleGroup,
            solid.faPenToSquare,
            solid.faCircleXmark,
            solid.faCamera,
            solid.faSpinner,
            solid.faThumbTack,
            solid.faImage,
            solid.faTriangleExclamation,
            solid.faPenToSquare,
            solid.faStore,
            solid.faBookmark,
            solid.faTrashCan,
            solid.faCalendarXmark,
            solid.faClock,
            brands.faGoogle,
            brands.faIoxhost,
            regulars.faCommentDots,
            regulars.faSquareCheck,
            regulars.faCalendar,
            regulars.faSquarePlus
            
            )
    }
}