import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { App } from './App';

describe('chat', () => {
  it('faz login, mostra resposta, abre trecho e registra avaliação', async () => {
    const api = { login: vi.fn().mockResolvedValue({ id: 'u', admin: false }), logout: vi.fn(), perguntar: vi.fn().mockResolvedValue([{ id: 'm', papel: 'assistente', conteudo: 'Reinicie [1]', fontes: [{ id: 't', artigo_id: 'a', titulo: 'Fila', conteudo: 'Reinicie a fila' }] }]), avaliar: vi.fn().mockResolvedValue(undefined), artigo: vi.fn().mockResolvedValue({ titulo: 'Fila', conteudo: 'Antes\nReinicie a fila\nDepois' }), lacunas: vi.fn() };
    render(<App api={api} />);
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'pessoa@example.test' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha-ficticia' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    fireEvent.change(await screen.findByLabelText('Pergunta'), { target: { value: 'Como reiniciar?' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Fonte 1: Fila' }));
    expect(await screen.findByText('Reinicie a fila', { selector: 'mark' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Resposta útil' }));
    await waitFor(() => expect(api.avaliar).toHaveBeenCalledWith('m', true));
  });
  it('mostra lacunas apenas ao administrador', async () => {
    const api = { login: vi.fn().mockResolvedValue({ id: 'admin', admin: true }), logout: vi.fn(), perguntar: vi.fn(), avaliar: vi.fn(), artigo: vi.fn(), lacunas: vi.fn().mockResolvedValue([{ id: 'l', pergunta: 'Pergunta sem resposta' }]) };
    render(<App api={api} />);
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'admin@example.test' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha-ficticia' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Lacunas' }));
    expect(await screen.findByText('Pergunta sem resposta')).toBeInTheDocument();
  });
});
