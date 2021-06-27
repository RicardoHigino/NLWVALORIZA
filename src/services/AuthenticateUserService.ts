import { getCustomRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import { UsersRepositories } from '../repositories/UsersRepositories'

interface IAuthenticateRequest {
  email: string
  password: string
}

class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories)

    // Verificar se email existe
    const user = await usersRepositories.findOne({
      email,
    })

    if (!user) {
      throw new Error('Email/Password incorrect')
    }
    // verificar se senha está correta

    // 123456 // 231231231-asjkdhljknq
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('Email/Password incorrect')
    }

    // Gerar token
    // MD5 GENERATOR
    const token = sign(
      {
        email: user.email,
      },
      'f848acf279a15408d469bdf8b2a57dae',
      {
        subject: user.id,
        expiresIn: '1d',
      }
    );

    return token;
  }
}

export { AuthenticateUserService }
