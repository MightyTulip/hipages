import { Request, Response } from 'express';
import pool from '../db';
import { 
  EntityNotFound, 
  ErrorCreatingEntity, 
  ErrorUpdatingEntity, 
  ErrorFetchingEntities, 
  MissingRequiredFields,
  InvalidStateTransition
} from '../constants/errorMessages';
import { ResultSetHeader } from 'mysql2';
import { ILead } from '../types/ILead';

export const getAllLeads = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<ILead[]>('SELECT * FROM leads');
    res.status(200).json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send(ErrorFetchingEntities);
  }
};

export const createLead = async (req: Request, res: Response) => {
  const { category, price } = req.body;

  if (!category || !price) {
    return res.status(400).send(MissingRequiredFields)
  }

  try {
    const [result] = await pool.query<ResultSetHeader>('INSERT INTO leads (category, price) VALUES (?, ?)', [category, price]);
    const [newLead] = await pool.query<ILead[]>('SELECT * FROM leads WHERE id = ?', [result.insertId]);
    res.status(201).json(newLead);
  } catch (e) {
    console.error(e);
    res.status(500).send(ErrorCreatingEntity);
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).send(MissingRequiredFields);
  }

  try {
    const [currentLeadResult] = await pool.query<ILead[]>('SELECT * FROM leads WHERE id = ?', [id]);
    if (!currentLeadResult.length) {
      return res.status(404).json({ error: EntityNotFound, message: `The entity with id ${id} does not exist.` });
    }
    if (currentLeadResult[0].status) {
      return res.status(400).send(InvalidStateTransition);
    }

    await pool.query<ResultSetHeader>('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
    const [updatedLead] = await pool.query<ILead[]>('SELECT * FROM leads WHERE id = ?', [id]);
    res.status(200).json(updatedLead);
  } catch (e) {
    console.error(e);
    res.status(500).send(ErrorUpdatingEntity);
  }
};
