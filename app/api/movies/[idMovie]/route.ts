// page/api/movies/[idMovie]/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';


/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     summary: Get a movie by ID
 *     description: Retrieve a specific movie from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the movie to retrieve.
 *     responses:
 *       200:
 *         description: Movie found and returned successfully.
 *       400:
 *         description: Invalid movie ID.
 *       404:
 *         description: Movie not found.
 *       500:
 *         description: Internal Server Error.
 */
export async function GET(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }
    
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(idMovie) });
    
    if (!movie) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { movie } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   post:
 *     summary: Create a new movie with specified ID
 *     description: Insert a new movie into the database using the provided ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID to assign to the new movie.
 *     responses:
 *       201:
 *         description: Movie successfully added.
 *       500:
 *         description: Internal Server Error.
 */

export async function POST(): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    // Construction du document
    const movie = {
      title: "test",
      year: 2025,
      director: "Thomas",
      genre: ["Sci-fi"],
      plot: "test test testt"
    };

    const result = await db.collection('movies').insertOne(movie);

    return NextResponse.json({
      status: 201,
      message: 'Movie successfully added',
      data: { insertedId: result.insertedId }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}


/**
 * @swagger
 * /api/movies/{idMovie}:
 *   put:
 *     summary: Update an existing movie
 *     description: Update an existing movie using its ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the movie to update.
 *     responses:
 *       200:
 *         description: Movie successfully updated.
 *       400:
 *         description: Invalid movie ID.
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error.
 */
export async function PUT(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idMovie } = params;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid movie ID',
        error: 'ID format is incorrect',
      });
    }

    const movie = {
      title: "Thomas2",
      year: 2014,
      director: "CThomas",
      genre: ["Sci-fi", "Adventure"],
      plot: "A group of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
    };

    const updateResult = await db.collection('movies').updateOne(
      { _id: new ObjectId(idMovie) },
      { $set: movie }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie to update with the given ID' });
    }

    return NextResponse.json({
      status: 200,
      message: 'Movie successfully updated',
      data: { updatedId: updateResult }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message
    });
  }

}



/**
 * @swagger
 * /api/movies/{idMovie}:
 *   delete:
 *     summary: Delete a movie by ID
 *     description: Delete a specific movie from the database.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the movie to delete.
 *     responses:
 *       200:
 *         description: Movie successfully deleted.
 *       400:
 *         description: Invalid movie ID.
 *       404:
 *         description: Movie not found.
 *       500:
 *         description: Internal Server Error.
 */

export async function DELETE(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }

    const result = await db.collection('movies').deleteOne({ _id: new ObjectId(idMovie) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie deleted' });
    }

    return NextResponse.json({ status: 200, message: 'Movie successfully deleted' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}