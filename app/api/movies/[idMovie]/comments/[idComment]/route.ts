import { NextResponse } from 'next/server';
import { MongoClient, ObjectId, Db } from 'mongodb';
import clientPromise from '@/lib/mongodb';


/**
 * @swagger
 * /api/movies/{idMovie}/comments/{idComment}:
 *   get:
 *     summary: Get a specific comment of a movie
 *     description: Retrieve a specific comment associated with a movie using comment ID and movie ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie.
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment.
 *     responses:
 *       200:
 *         description: Comment found and returned successfully.
 *       400:
 *         description: Invalid ID format.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Internal Server Error.
 */



export async function GET(request: Request,{ params }: { params: any }): Promise<NextResponse> {
  try {
    const { idMovie, idComment } = params;
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid ID format' });
    }

    const comment = await db.collection('comments').findOne({
      _id: new ObjectId(idComment),
      movie_id: new ObjectId(idMovie),
    });

    if (!comment) {
      return NextResponse.json({ status: 404, message: 'Comment not found' });
    }

    return NextResponse.json({ status: 200, data: comment });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}/comments/{idComment}:
 *   post:
 *     summary: Add a hardcoded comment to a movie (only if idComment is 'null')
 *     description: Inserts a new hardcoded comment to a movie. This route only accepts POST if the idComment path parameter is "null".
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to add the comment to.
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *           example: null
 *         description: Must be the string "null" to allow creation.
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Comment created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     insertedId:
 *                       type: string
 *                       example: 5f7e1bb7b54764421b7156c2
 *       400:
 *         description: Invalid movie ID format or idComment is not "null".
 *       500:
 *         description: Internal Server Error.
 */
export async function POST(
    request: Request,
    { params }: { params: any }
  ): Promise<NextResponse> {
    try {
      const { idMovie, idComment } = params;
  
      // Si idComment n'est pas "null", on refuse l'appel POST ici.
      if (idComment !== 'null') {
        return NextResponse.json({
          status: 400,
          message: 'POST must target /comments/null only',
        });
      }
  
      if (!ObjectId.isValid(idMovie)) {
        return NextResponse.json({
          status: 400,
          message: 'Invalid movie ID format',
        });
      }
  
      const client: MongoClient = await clientPromise;
      const db: Db = client.db('sample_mflix');
  
      // Données en dur
      const newComment = {
        name: "test",
        email: "test",
        text: "test",
        movie_id: new ObjectId(idMovie),
        date: new Date(),
      };
  
      const result = await db.collection('comments').insertOne(newComment);
  
      return NextResponse.json({
        status: 201,
        message: 'Comment created successfully',
        data: { insertedId: result.insertedId },
      });
    } catch (error: any) {
      return NextResponse.json({
        status: 500,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }


/**
 * @swagger
 * /api/movies/{idMovie}/comments/{idComment}:
 *   put:
 *     summary: Update a specific comment of a movie
 *     description: Update the text content of a specific comment using its ID and the associated movie ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie.
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Updated comment text here."
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *       400:
 *         description: Invalid ID format.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Internal Server Error.
 */



export async function PUT(
  request: Request,
  { params }: { params: any }
): Promise<NextResponse> {
  try {
    const { idMovie, idComment } = params;
    const { text } = await request.json();

    if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid ID format' });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const result = await db.collection('comments').updateOne(
      { _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie) },
      { $set: { text } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Comment not found' });
    }

    return NextResponse.json({ status: 200, message: 'Comment updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}


/**
 * @swagger
 * /api/movies/{idMovie}/comments/{idComment}:
 *   delete:
 *     summary: Delete a specific comment of a movie
 *     description: Delete a comment by its ID and the associated movie ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie.
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment.
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *       400:
 *         description: Invalid ID format.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Internal Server Error.
 */


export async function DELETE(
  request: Request,
  { params }: { params: any }
): Promise<NextResponse> {
  try {
    const { idMovie, idComment } = params;

    if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid ID format' });
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const result = await db.collection('comments').deleteOne({
      _id: new ObjectId(idComment),
      movie_id: new ObjectId(idMovie),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Comment not found' });
    }

    return NextResponse.json({ status: 200, message: 'Comment deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
