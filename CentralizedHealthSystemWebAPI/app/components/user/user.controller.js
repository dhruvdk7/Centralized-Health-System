const UserService = require('./user.service');

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async createUser(request, response, next) {
        try {
            const userId = await this.userService.createUser(request.body);
            response.status(200).json({ userId });
        } catch (error) {
            next(error);
        }
    }

    async loginUser(request, response, next) {
        try {
            const { email, password, rememberMe } = request.body;
            const userDetails = await this.userService.loginUser(email, password, rememberMe);
            response.status(200).json(userDetails);
        } catch (error) {
            next(error);
        }
    }
    async getUserDetailById(request, response, next) {
        try {
            const { userId } = request.params;
            const userDetail = await this.userService.getUserDetailById(userId);
            response.status(200).json(userDetail);
        } catch (error) {
            next(error);
        }
    }

    async softDeleteUserById(request, response, next) {
        try {
            const { userId } = request.params;
            await this.userService.softDeleteUserById(userId);
            response.status(204).json();
        } catch (error) {
            next(error);
        }
    }

    async filterUsers(request, response, next) {
        try {
            const { status, role, name } = request.body;
            const usersDetails = await this.userService.filterUsers(status, role, name);
            response.status(200).json(usersDetails);
        } catch (error) {
            next(error);
        }
    }

    async updateUserStatus(request, response, next) {
        try {
            const { userId } = request.params;
            const { status, remarks } = request.body;
            await this.userService.updateUserStatus(userId, status, remarks);
            response.status(204).json();
        } catch (error) {
            next(error);
        }
    }

    async verifyUser(request, response, next) {
        try {
            const { verificationCode } = request.body;
            await this.userService.verifyUser(verificationCode);
            response.status(204).json();
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(request, response, next) {
        try {
            const { email } = request.body;
            await this.userService.forgotPassword(email);
            response.status(204).json();
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(request, response, next) {
        try {
            const { token, password } = request.body;
            await this.userService.resetPassword(token, password);
            response.status(204).json();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
