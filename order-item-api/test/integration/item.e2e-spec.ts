import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('ItemController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/item').expect(200).expect([{}]);
  });

  it('/ (POST)', () => {
    return request(app.getHttpServer()).post('/item').expect(201);
  });

  it('/ (PUT)', () => {
    return request(app.getHttpServer()).put('/item').expect(204);
  });

  it('/ (DELETE)', () => {
    return request(app.getHttpServer()).delete('/item').expect(204);
  });
});
