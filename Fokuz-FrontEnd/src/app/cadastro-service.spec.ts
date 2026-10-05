import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { CadastroService } from './cadastro-service';

describe('CadastroService', () => {
  let service: CadastroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(CadastroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
