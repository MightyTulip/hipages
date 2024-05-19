// @ts-nocheck
import { 
  getAllLeads, 
  createLead, 
  updateStatus 
} from '../controllers/leadController';
import pool from '../db';
import { allLeads } from './mocks/leads';
import { 
  EntityNotFound, 
  ErrorCreatingEntity,
  ErrorUpdatingEntity, 
  ErrorFetchingEntities, 
  MissingRequiredFields,
  InvalidStateTransition
} from '../constants/errorMessages';

jest.mock('../db', () => ({
  query: jest.fn()
}));

describe('Lead Controller', () => {
  describe('getAllLeads', () => {
    it('should return a list of leads', async () => {
      const querySpy = jest.spyOn(pool, 'query');
      querySpy.mockResolvedValue([allLeads, []]);
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      
      await getAllLeads(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(allLeads);
    });

    it('should handle errors', async () => {
      const querySpy = jest.spyOn(pool, 'query');
      querySpy.mockRejectedValue(new Error('Database Error'));
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      
      await getAllLeads(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(ErrorFetchingEntities);
    });
  });

  describe('createLead', () => {
    it('should create a new lead and return it', async () => {
      const newLead = { 
        id: 7, 
        category: 'Painter', 
        status: 'pending', 
        price: '150.00' 
      };
      const insertResult = { 
        insertId: 7, 
        affectedRows: 1,
      };
      const querySpy = jest.spyOn(pool, 'query');
      querySpy.mockResolvedValueOnce([insertResult]).mockResolvedValueOnce([newLead]);
      const req = {
        body: { 
          category: 'Painter', 
          status: 'pending', 
          price: '150.00' 
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createLead(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newLead);
    });

    it('should handle errors', async () => {
      const querySpy = jest.spyOn(pool, 'query');
      querySpy.mockRejectedValue(new Error('Database Error'));
      const req = {
        body: { 
          category: 'Painter', 
          status: 'pending', 
          price: '150.00' 
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await createLead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(ErrorCreatingEntity);
    });

    it('should return 400 if required fields are missing', async () => {
      const req = {
        body: { status: 'pending', price: '150.00' }, 
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await createLead(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(MissingRequiredFields);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an existing lead', async () => {
      const updatedLead = { ...allLeads[0] };
      const updateResult = { ...updatedLead, affectedRows: 1, insertId: 1 };

      const querySpy = jest.spyOn(pool, 'query');
      querySpy.mockResolvedValueOnce([[updatedLead]])
              .mockResolvedValueOnce([updateResult])
              .mockResolvedValueOnce([updateResult]);

      const req = {
        params: { id: updatedLead.id.toString() },
        body: { status: 'accepted' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updateResult);
    });

    it('should return 400 if updating status from declined to pending', async () => {
      const updatedLead = { ...allLeads[2] };

      const querySpy = jest.spyOn(pool, 'query');
      querySpy.mockResolvedValueOnce([[updatedLead]]);

      const req = {
        params: { id: updatedLead.id.toString() },
        body: { status: 'pending' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await updateStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(InvalidStateTransition);
    });

    it('should return 400 if updating status from accepted to pending', async () => {
      const updatedLead = { ...allLeads[1] };

      const querySpy = jest.spyOn(pool, 'query');
      querySpy.mockResolvedValueOnce([[updatedLead]]);

      const req = {
        params: { id: updatedLead.id.toString() },
        body: { status: 'pending' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await updateStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(InvalidStateTransition);
    });

    it('should return 400 if required fields are missing', async () => {
      const req = {
        params: { id: '1' },
        body: {}, 
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await updateStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(MissingRequiredFields);
    });

    it('should return 404 if the lead does not exist', async () => {
      const updateResult = { affectedRows: 0 };
      const querySpy = jest.spyOn(pool, 'query');
      querySpy.mockResolvedValueOnce([updateResult, []]);
      const req = {
        params: { id: '999' },
        body: { status: 'accepted' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: EntityNotFound, message: `The entity with id 999 does not exist.` });
    });

    it('should handle errors', async () => {
      const querySpy = jest.spyOn(pool, 'query');
      querySpy.mockRejectedValue(new Error('Database Error'));
      const req = {
        params: { id: '1' },
        body: { status: 'accepted' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await updateStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(ErrorUpdatingEntity);
    });
  });
});
