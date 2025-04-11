import { NextResponse } from 'next/server';
import { MongoClient, ObjectId, Db } from 'mongodb';
import clientPromise from '@/lib/mongodb'; // adapte ce chemin si nécessaire


/** 
 * @swagger
 * /api/movies/{idMovie}/comments:
 *   get:
 *     summary: Get all comments for a movie
 *     description: Retrieve all comments associated with a specific movie from the database.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the movie for which to retrieve comments.
 *     responses:
 *       200:
 *         description: Comments found and returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 5a9427648b0beebeb6957a88
 *                       name:
 *                         type: string
 *                         example: Thomas Morris
 *                       email:
 *                         type: string
 *                         example: thomas_morris@fakegmail.com
 *                       movie_id:
 *                         type: string
 *                         example: 573a1390f29313caabcd680a
 *                       text:
 *                         type: string
 *                         example: Perspiciatis sequi nesciunt maiores...
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: 2004-02-26T06:33:03.000Z
 *       400:
 *         description: Invalid movie ID format.
 *       500:
 *         description: Internal Server Error.
 */

export async function GET(  request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idMovie } = params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({
        status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' }
      );
    }

    const comments = await db
      .collection('comments')
      .find({ movie_id: new ObjectId(idMovie) })
      .toArray();

    return NextResponse.json({
      status: 200,
      data: comments,
    });
  } 
  catch (error: any) {
    return NextResponse.json({
      status: 500, message: 'Internal Server Error', error: error.message }
    );
  }
}



/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Not supported
 *     description: This endpoint does not support POST method
 *     responses:
 *       405:
 *         description: Method Not Allowed - POST is not supported
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ status: 405, message: 'Method Not Allowed', error: 'POST method is not supported' });
}

/**
* @swagger
* /api/movies:
*   put:
*     summary: Not supported
*     description: This endpoint does not support PUT method
*     responses:
*       405:
*         description: Method Not Allowed - PUT is not supported
*/
export async function PUT(): Promise<NextResponse> {
  return NextResponse.json({ status: 405, message: 'Method Not Allowed', error: 'PUT method is not supported' });
}

/**
* @swagger
* /api/movies:
*   delete:
*     summary: Not supported
*     description: This endpoint does not support DELETE method
*     responses:
*       405:
*         description: Method Not Allowed - DELETE is not supported
*/
export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({ status: 405, message: 'Method Not Allowed', error: 'DELETE method is not supported' });
}
