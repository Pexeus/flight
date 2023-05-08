import os

class Converter():
    def pmw(self, axis):
        return int(round(1500 + (float(axis) * 500)))

    def h2642mp4(self, input, framerate):
        output = os.path.splitext(input)[0] + '.mp4'
        command = f'ffmpeg -framerate {framerate} -i {input} -c:v libx264 {output}'
        
        os.system(command)
        os.remove(input)

        return output