import moment from 'moment'
import 'moment/locale/vi'

export const formatTime = (createdAt) => {
   moment.locale('vi');
   return moment(createdAt).fromNow()
}