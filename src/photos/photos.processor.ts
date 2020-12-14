import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('photo')
export class PhotoConsumer {
  @Process()
  handlePhoto(job: Job) {
    // Generate thumnbnails and resize original photo.
    console.log('Queue', job.data);
  }
}
