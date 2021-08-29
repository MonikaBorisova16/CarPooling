import { UserDTO } from '../dto/UserDTO';
import { User, UserDetails } from './../models/User'

export async function userToUserDTO(userID: string) {
    const user = await User.findById(userID);
    var dto = new UserDTO();
    if (user != undefined && user != null) {
        dto.username = user.username;
        dto.id = user.id;

        const userDetails = await UserDetails.findById(user?.userDetailsID);
        if (userDetails != undefined && userDetails != null) {

            dto.firstName = userDetails.firstName;
            dto.lastName = userDetails.lastName;
            dto.phone = userDetails.phone;
            dto.email = userDetails.email;
            dto.avatarUri = userDetails.avatar;
        }
    }
    return dto;
}