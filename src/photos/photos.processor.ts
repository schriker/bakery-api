import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as sharp from 'sharp';
import { unlinkSync } from 'fs';

@Processor('photo')
export class PhotoConsumer {
  @Process()
  handlePhoto(job: Job) {
    sharp(`${job.data.path}/${job.data.name}`)
      .resize(200)
      .toFile(`${job.data.path}/thumbnail_${job.data.name}`)
      .catch((e) => {
        console.log(e);
      });
    sharp(`${job.data.path}/${job.data.name}`)
      .resize(800)
      .toFile(`${job.data.path}/full_${job.data.name}`)
      .then(() => {
        unlinkSync(`${job.data.path}/${job.data.name}`);
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
