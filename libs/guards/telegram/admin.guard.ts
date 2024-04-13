import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class TelegramAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.getArgByIndex(0);

    const id = ctx?.update?.message?.from?.id || 0;
    const ids = this.reflector.get('admins', context.getHandler());

    if (ids?.length && !ids.includes(id)) return false;
    return true;
  }
}
