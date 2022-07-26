import db from '../db';
import DatabaseError from '../models/Errors/database.error.model';
import User from '../models/user.models';

class userRepository {
    async findAllusers(): Promise<User[]> {
        const query = `
        SELECT uuid, username FROM application_user
        `;

        const result = await db.query<User>(query);
        const rows = result.rows;

        return rows || [];
    }

    async findById(uuid: string): Promise<User> {
        try {
            const query = `
            SELECT uuid, username FROM application_user WHERE uuid = $1
            `;

            const values = [uuid];

            const { rows } = await db.query<User>(query, values);
            const [user] = rows;

            return user;
        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID');
        }
    }

    async findUsernameAndPassword(username: string, password: string): Promise<User | null> {
        try {
            const query = `
        SELECT uuid, username FROM application_user WHERE username = $1 AND password = crypt($2, 'my_salt')
        `;
            const values = [username, password];
            const { rows } = await db.query<User>(query, values);
            const [user] = rows;
            return user || null;
        } catch (error) {
            throw new DatabaseError('Error na consulta por usarname e password');
        }
    }

    async create(user: User): Promise<string> {
        const script = `
        INSERT INTO application_user (username, password) VALUES ($1, crypt($2, 'my_salt')) RETURNING uuid
        `;

        const values = [user.username, user.password];

        const { rows } = await db.query<{ uuid: string }>(script, values);
        const [newUser] = rows;

        return newUser.uuid;
    }

    async update(user: User): Promise<void> {
        const script = `
        UPDATE application_user SET username = $1, password = crypt($2, 'my_salt') WHERE uuid = $3
        `;

        const values = [user.username, user.password, user.uuid];

        await db.query(script, values);
    }

    async remove(uuid: string): Promise<void> {
        const script = `
        DELETE FROM application_user WHERE uuid = $1
        `;

        const values = [uuid];

        await db.query(script, values);
    }
}

export default new userRepository();