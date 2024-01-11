import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TelegramAdminGuard implements CanActivate {
  constructor(private readonly ids: number[]) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.getArgByIndex(0);

    const id = ctx?.update?.message?.from?.id || 0;

    if (!this.ids.includes(id)) return false;
    return true;
  }
}
