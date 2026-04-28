import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { StatusPillComponent } from '../../../../shared/components/status-pill/status-pill.component';

@Component({
  selector: 'fm-profile-page',
  standalone: true,
  imports: [StatusPillComponent],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly profile = inject(ProfileService);

  readonly displayProfile = computed(() => {
    const profile = this.profile.profile();
    const session = this.auth.session();

    return {
      fullName: profile?.fullName ?? session?.fullName ?? 'Food Mania User',
      email: profile?.email ?? session?.email ?? '',
      role: profile?.role ?? session?.role ?? 'ROLE_USER',
      createdAt: profile?.createdAt ? this.formatDate(profile.createdAt) : 'Session account'
    };
  });

  ngOnInit(): void {
    if (!this.auth.isAdmin()) {
      this.profile.loadMe().subscribe({ error: () => undefined });
    }
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(new Date(value));
  }
}
