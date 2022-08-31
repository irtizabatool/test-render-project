import { Test } from "@nestjs/testing";
import { RoleType, User } from "@prisma/client";
import { PageDto } from "../../common/dto/PageDto";
import { ResponseSuccess } from "../../common/dto/ResponseSuccess.dto";
import { PasswordResponseDto } from "../auth/dto/PasswordResponse.dto";
import { CheckUserStatusDto } from "./dto/ChangeUserStatus.dto";
import { UserFilterDto } from "./dto/UserFilter.dto";
import { UserInviteDto } from "./dto/UserInvite.dto";
import { UserUpdateDto } from "./dto/UserUpdate.dto";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

const mockedPasswordResponse = {
  userId: "eb0b39bb-5810-4229-926f-04cdb5c31245",
  token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0
        NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5M
        DIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
};

const mockedUsers = [
  {
    id: "eb0b39bb-5810-4229-926f-04cdb5c31245",
    firstName: "John",
    lastName: "Wick",
    role: RoleType.RECRUITER_ADMIN,
    email: "john@crownstack.com",
    password: "password",
  },
  {
    id: "fb0b39bb-5810-4229-926f-04cdb5c31245",
    firstName: "Jerry",
    lastName: "Paul",
    role: RoleType.INTERVIEWER,
    email: "jerry@crownstack.com",
    password: "password",
  },
  {
    id: "gb0b39bb-5810-4229-926f-04cdb5c31245",
    firstName: "admin",
    lastName: "admin",
    role: RoleType.TEAM_LEAD,
    email: "admin@crownstack.com",
    password: "password",
  },
];

const mockedInviteUserDto = {
  firstName: "Team",
  lastName: "Lead",
  email: "teamlead@crownstack.com",
  role: RoleType.TEAM_LEAD,
};

const mockedUserService = {
  inviteUser: jest.fn(),
  resendInvite: jest.fn(),
  users: jest.fn(),
  changeUserStatus:  jest.fn(),
  updateUser: jest.fn(),
};

describe("UserController", () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserService,
          useValue: mockedUserService,
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe("invite", () => {
    it("should return userId and token", async () => {
      const user: any = mockedUsers[0];
      const userInviteDto = <UserInviteDto>{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };
      const passwordResponse = mockedPasswordResponse;
      const mockedResponseSuccess = new ResponseSuccess(
        `Invite send successfully`,
        passwordResponse
      );

      jest
        .spyOn(userService, "inviteUser")
        .mockImplementation(() =>
          Promise.resolve(<PasswordResponseDto>passwordResponse)
        );

      expect(userController.inviteUser(userInviteDto)).resolves.toStrictEqual(
        mockedResponseSuccess
      );
    });
  });

  describe("resend-invite/:userId", () => {
    it("should return userId and token", async () => {
      const user: any = mockedUsers[0];
      const passwordResponse = mockedPasswordResponse;
      const mockedResponseSuccess = new ResponseSuccess(
        `Invite send successfully`,
        passwordResponse
      );

      jest
        .spyOn(userService, "resendInvite")
        .mockImplementation(() =>
          Promise.resolve(<PasswordResponseDto>passwordResponse)
        );

      expect(userController.resendInvite(user.id)).resolves.toStrictEqual(
        mockedResponseSuccess
      );
    });
  });

  describe("team", () => {
    it("should return list of team members", async () => {
      const users: any = mockedUsers;
      const pageMetaDto: any = {};
      const pageDto = new PageDto(users, pageMetaDto);
      const query = "sampleQuery";
      const userPageOptionsDto: any = {};
      const filterData = new UserFilterDto()
      const mockedResponseSuccess = new ResponseSuccess(
        `Team Member List`,
        pageDto
      );

      jest
        .spyOn(userService, "users")
        .mockImplementation(() => Promise.resolve(<PageDto>pageDto));

      expect(userController.getAll(userPageOptionsDto, filterData, userPageOptionsDto)).resolves.toStrictEqual(
        mockedResponseSuccess
      );
    });
  });

  describe("change-status", () => {
    it("should return deactivated status of user", async () => {
      const user: any = mockedUsers[0];
      const changeUserStatusDto: CheckUserStatusDto = {
        id: user.id,
        loginAccess: false
      }
      const updatedUser = 'deactivated'
      const mockedResponseSuccess = new ResponseSuccess(
        `User has been ${updatedUser}`
      );

      jest
        .spyOn(userService, "changeUserStatus")
        .mockImplementation(() => Promise.resolve(updatedUser));

      expect(userController.changeUserStatus(changeUserStatusDto)).resolves.toStrictEqual(
        mockedResponseSuccess
      );
    });

    it("should return activated status of user", async () => {
        const user: any = mockedUsers[0];
        const changeUserStatusDto: CheckUserStatusDto = {
          id: user.id,
          loginAccess: true
        }
        const updatedUser = 'activated'
        const mockedResponseSuccess = new ResponseSuccess(
          `User has been ${updatedUser}`
        );
  
        jest
          .spyOn(userService, "changeUserStatus")
          .mockImplementation(() => Promise.resolve(updatedUser));
  
        expect(userController.changeUserStatus(changeUserStatusDto)).resolves.toStrictEqual(
          mockedResponseSuccess
        );
      });
  });

  describe("update", () => {
    it("should update user and return success message", async () => {
      const user: any = mockedUsers[0];
      const userUpdateDto = <UserUpdateDto>{
        firstName: user.firstName,
        lastName: user.lastName,
      };
      const mockedResponseSuccess = new ResponseSuccess(
        `Your profile has been updated successfully`, true );

      jest
        .spyOn(userService, "updateUser")
        .mockImplementation(() =>
          Promise.resolve(true)
        );

      expect(userController.updateUser(userUpdateDto, user)).resolves.toStrictEqual(
        mockedResponseSuccess
      );
    });
  });
});
