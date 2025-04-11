// page/api/theaters/[idTheater]/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';


/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   get:
 *     summary: Get a theater by ID
 *     description: Retrieve a specific theater from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the theater to retrieve.
 *     responses:
 *       200:
 *         description: theater found and returned successfully.
 *       400:
 *         description: Invalid theater ID.
 *       404:
 *         description: Theater not found.
 *       500:
 *         description: Internal Server Error.
 */
export async function GET(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const { idTheater } = params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }
    
    const theater = await db.collection('theaters').findOne({ _id: new ObjectId(idTheater) });
    
    if (!theater) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { theater } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   post:
 *     summary: Create a new theater with specified ID
 *     description: Insert a new theater into the database using the provided ID.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID to assign to the new theater.
 *     responses:
 *       201:
 *         description: Theater successfully added.
 *       500:
 *         description: Internal Server Error.
 */

export async function POST(): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    // Construction du document
    const theater = {
      theaterId: "test"
    };

    const result = await db.collection('theaters').insertOne(theater);

    return NextResponse.json({
      status: 201,
      message: 'Theater successfully added',
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
 * /api/theaters/{idTheater}:
 *   put:
 *     summary: Update an existing theater
 *     description: Update an existing theater using its ID.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the theater to update.
 *     responses:
 *       200:
 *         description: Theater successfully updated.
 *       400:
 *         description: Invalid theater ID.
 *       404:
 *         description: Theater not found
 *       500:
 *         description: Internal Server Error.
 */
export async function PUT(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid theater ID',
        error: 'ID format is incorrect',
      });
    }

    const theater = {
        theaterId: "test2"
      };

    const updateResult = await db.collection('theaters').updateOne(
      { _id: new ObjectId(idTheater) },
      { $set: theater }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater to update with the given ID' });
    }

    return NextResponse.json({
      status: 200,
      message: 'Theater successfully updated',
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
 * /api/theaters/{idTheater}:
 *   delete:
 *     summary: Delete a theater by ID
 *     description: Delete a specific theater from the database.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the theater to delete.
 *     responses:
 *       200:
 *         description: Theater successfully deleted.
 *       400:
 *         description: Invalid theater ID.
 *       404:
 *         description: Theater not found.
 *       500:
 *         description: Internal Server Error.
 */

export async function DELETE(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }

    const result = await db.collection('theaters').deleteOne({ _id: new ObjectId(idTheater) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater deleted' });
    }

    return NextResponse.json({ status: 200, message: 'Theater successfully deleted' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}